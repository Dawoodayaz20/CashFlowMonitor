import useAuthStore from "../../store/useAuthStore"
// import { useNavigate } from 'react-router-dom';

export const SignIn = async (email:string, password: string, navigate: any) => {
  const { setUser } = useAuthStore.getState();

  try{
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method:'POST',
      headers:{ 'Content-Type': 'application/json' },
      credentials:'include',
      body: JSON.stringify({email, password})
    })

    const data = await response.json();
    if(response.ok){
      setUser(data.user);
      navigate('/dashboard')
    }
    console.log('Login response:', data);
    return data;
  }
  catch(error){
    console.error("There was an error processing Login Request:", error);
  }
}

export const SignUp = async (name : string, email : string, pass : string) => {
  
  try {
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        name: name,
        email: email,
        password: pass
      })
    });
    
    // console.log('Response status:', response.status)
    const data = await response.json();
    console.log('Backend Response:', data);
    console.log('Status:', response.status);  // ADD THIS

  } catch (error) {
    console.error('Error:', error);
  }
};

// Add button
{/* <button onClick={testBackend}>Test Backend</button> */}

