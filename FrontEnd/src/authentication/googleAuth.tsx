import { useGoogleLogin } from '@react-oauth/google';
import useAuthStore from '../store/useAuthStore';

export const GoogleSignIn = async (accessToken: string, navigate: any) => {
    const { setUser } = useAuthStore(); 

    try{
        const response = await fetch('', {
            method: 'POST',
            headers: { 'Content-Type': 'application-json'},
            credentials: 'include',
            body: JSON.stringify({ token: accessToken})
        })
        const data = await response.json();
        if (response.ok) {
        setUser(data.user);
        navigate('/dashboard');
        }
        return data;
    } catch (error) {
        console.error('Google Sign-In error:', error);
    }
}