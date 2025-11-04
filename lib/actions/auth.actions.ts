'use server';

import {auth} from "@/lib/better-auth/auth";
import {headers} from "next/headers";

export const signUpWithEmail = async ({ email, password, fullName }: SignUpFormData) => {
    try {
        const response = await auth.api.signUpEmail({ body: { email, password, name: fullName } })

        return { success: true, data: response }
    } catch (e: any) {
        console.log('Sign up failed', e)
        
        // Extract the specific error message from Better Auth
        const errorMessage = e?.message || e?.body?.message || 'Failed to create account';
        
        // Check for common error scenarios
        if (errorMessage.toLowerCase().includes('already') || errorMessage.toLowerCase().includes('exists')) {
            return { success: false, error: 'An account with this email already exists' }
        }
        
        return { success: false, error: errorMessage }
    }
}

export const signInWithEmail = async ({ email, password }: SignInFormData) => {
    try {
        const response = await auth.api.signInEmail({ body: { email, password } })

        return { success: true, data: response }
    } catch (e: any) {
        console.log('Sign in failed', e)
        
        // Extract the specific error message from Better Auth
        const errorMessage = e?.message || e?.body?.message || 'Invalid email or password';
        
        return { success: false, error: errorMessage }
    }
}

export const signOut = async () => {
    try {
        await auth.api.signOut({ headers: await headers() });
    } catch (e) {
        console.log('Sign out failed', e)
        return { success: false, error: 'Sign out failed' }
    }
}
