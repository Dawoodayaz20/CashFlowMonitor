// In any component
const SignUp = async (name : string, email : string, pass : string) => {
  
  
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

export default SignUp;