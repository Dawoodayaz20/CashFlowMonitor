// In any component
const Backend = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        name: 'John',
        message: 'Hello from frontend!' 
      })
    });
    
    const data = await response.json();
    console.log('Backend response:', data);
    alert(JSON.stringify(data));
  } catch (error) {
    console.error('Error:', error);
  }
};

// Add button
{/* <button onClick={testBackend}>Test Backend</button> */}

export default Backend;