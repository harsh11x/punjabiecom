import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const mkdir = promisify(fs.mkdir)
const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)
const access = promisify(fs.access)

const DATA_DIR = path.resolve(process.cwd(), 'data')
const USERS_FILE = path.join(DATA_DIR, 'users.json')
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json')

export interface FileUser {
	id: string
	name: string
	email: string
	passwordHash: string
	phone?: string
	role: 'user' | 'admin'
	gender?: 'male' | 'female' | 'other'
	address?: {
		street?: string
		city?: string
		state?: string
		pincode?: string
	}
	isVerified?: boolean
	createdAt: string
	updatedAt: string
}

interface FileStoreShape {
	version: number
	users: FileUser[]
}

interface SessionStoreShape {
	version: number
	sessions: { token: string; userId: string; issuedAt: number; expiresAt: number }[]
}

async function ensureDataFiles(): Promise<void> {
	try {
		await access(DATA_DIR, fs.constants.F_OK)
	} catch {
		await mkdir(DATA_DIR, { recursive: true })
	}
	try {
		await access(USERS_FILE, fs.constants.F_OK)
	} catch {
		const seed: FileStoreShape = { version: 1, users: [] }
		await writeFile(USERS_FILE, JSON.stringify(seed, null, 2), 'utf8')
	}
	try {
		await access(SESSIONS_FILE, fs.constants.F_OK)
	} catch {
		const seed: SessionStoreShape = { version: 1, sessions: [] }
		await writeFile(SESSIONS_FILE, JSON.stringify(seed, null, 2), 'utf8')
	}
}

async function readUsers(): Promise<FileStoreShape> {
	await ensureDataFiles()
	const buf = await readFile(USERS_FILE, 'utf8')
	return JSON.parse(buf)
}

async function writeUsers(data: FileStoreShape): Promise<void> {
	await writeFile(USERS_FILE, JSON.stringify(data, null, 2), 'utf8')
}

async function readSessions(): Promise<SessionStoreShape> {
	await ensureDataFiles()
	const buf = await readFile(SESSIONS_FILE, 'utf8')
	return JSON.parse(buf)
}

async function writeSessions(data: SessionStoreShape): Promise<void> {
	await writeFile(SESSIONS_FILE, JSON.stringify(data, null, 2), 'utf8')
}

export async function findUserByEmail(email: string): Promise<FileUser | undefined> {
	const store = await readUsers()
	return store.users.find(u => u.email.toLowerCase() === email.toLowerCase())
}

export async function findUserById(id: string): Promise<FileUser | undefined> {
	const store = await readUsers()
	return store.users.find(u => u.id === id)
}

export async function createUser(params: { name: string; email: string; password: string; phone?: string; gender?: FileUser['gender']; role?: FileUser['role'] }): Promise<FileUser> {
	const existing = await findUserByEmail(params.email)
	if (existing) throw new Error('Email already exists')
	const passwordHash = await bcrypt.hash(params.password, 12)
	const now = new Date().toISOString()
	const user: FileUser = {
		id: generateId(),
		name: params.name,
		email: params.email.toLowerCase(),
		passwordHash,
		phone: params.phone,
		gender: params.gender,
		role: params.role || 'user',
		isVerified: false,
		createdAt: now,
		updatedAt: now,
	}
	const store = await readUsers()
	store.users.push(user)
	await writeUsers(store)
	return user
}

export async function updateUser(id: string, updates: Partial<Omit<FileUser, 'id' | 'passwordHash' | 'createdAt' | 'updatedAt'>> & { password?: string }): Promise<FileUser> {
	const store = await readUsers()
	const idx = store.users.findIndex(u => u.id === id)
	if (idx === -1) throw new Error('User not found')
	const current = store.users[idx]
	const now = new Date().toISOString()
	let passwordHash = current.passwordHash
	if (updates.password) {
		passwordHash = await bcrypt.hash(updates.password, 12)
	}
	const merged: FileUser = {
		...current,
		...sanitizeUserUpdates(updates),
		passwordHash,
		updatedAt: now,
	}
	store.users[idx] = merged
	await writeUsers(store)
	return merged
}

function sanitizeUserUpdates(updates: any): Partial<FileUser> {
	const allowed: Partial<FileUser> = {}
	if (typeof updates.name === 'string') allowed.name = updates.name
	if (typeof updates.email === 'string') allowed.email = updates.email.toLowerCase()
	if (typeof updates.phone === 'string') allowed.phone = updates.phone
	if (typeof updates.gender === 'string') allowed.gender = updates.gender
	if (typeof updates.address === 'object') allowed.address = updates.address
	if (typeof updates.isVerified === 'boolean') allowed.isVerified = updates.isVerified
	return allowed
}

export async function verifyPassword(user: FileUser, password: string): Promise<boolean> {
	return bcrypt.compare(password, user.passwordHash)
}

export function signUserToken(user: FileUser): string {
	const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '7d' })
	return token
}

export async function addSession(token: string, userId: string, expiresAt: number): Promise<void> {
	const store = await readSessions()
	store.sessions.push({ token, userId, issuedAt: Date.now(), expiresAt })
	await writeSessions(store)
}

export async function removeSession(token: string): Promise<void> {
	const store = await readSessions()
	store.sessions = store.sessions.filter(s => s.token !== token)
	await writeSessions(store)
}

export async function isSessionActive(token: string): Promise<boolean> {
	const store = await readSessions()
	const s = store.sessions.find(s => s.token === token)
	return !!s && s.expiresAt > Date.now()
}

function generateId(): string {
	return 'u_' + Math.random().toString(36).slice(2) + Date.now().toString(36)
}
