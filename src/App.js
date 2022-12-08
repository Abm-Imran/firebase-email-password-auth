import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import app from './firebase.init';
import { Form } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { useState } from 'react';

const auth = getAuth(app);

function App() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [registered, setRegistered] = useState(false);

  const googleProvider = new GoogleAuthProvider();

  const handleGoogleSignIn =()=>{
    signInWithPopup(auth, googleProvider)
    .then(result =>{
      console.log(result.user);
    })
    .catch((error)=>{
      console.log(error);
      setError(error);
    })
  }

  const handleFormSubmit = (e) => {
    if (!registered) {
      createUserWithEmailAndPassword(auth, email, password)
        .then(result => {
          console.log(result.user);
          setEmail('');
          setPassword('');
          verifyEmail();
        })
        .catch(error => {
          console.error(error);
          setError(error);
        })
    }
    else {
      signInWithEmailAndPassword(auth, email, password)
        .then(result => {
          console.log('Login successfull', result.user);
        })
        .catch(error => {
          console.error(error);
          setError(error);
        })
    }
    e.preventDefault();
    // setEmail('');
    // setPassword('');

  }

  const verifyEmail = () => {
    sendEmailVerification(auth.currentUser)
      .then(() => {
        console.log('Send Email Verification');
      })
  }

  const handleForgetPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log('Reset Password Email Sent');
      })
  }

  const handleEmailChange = (e) => {
    // console.log(e.target.value);
    setEmail(e.target.value);
  }

  const handlePasswordChange = (e) => {
    // console.log(e.target.value);
    setPassword(e.target.value);
  }

  const handleRegistered = (e) => {
    // console.log(e.target.checked);
    setRegistered(e.target.checked);
  }




  return (
    <div className="">
      <Form onSubmit={handleFormSubmit} className='w-50 mx-auto mt-2'>
        <h2 className='text-primary' >Please {registered ? 'Login' : 'Register'}</h2>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control onBlur={handleEmailChange} type="email" placeholder="Enter email" required />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control onBlur={handlePasswordChange} type="password" placeholder="Password" required />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check onChange={handleRegistered} type="checkbox" label="Already Registered ?" />
        </Form.Group>
        <Button onClick={handleForgetPassword} variant="link">Forget Password?</Button>
        <Button onClick={handleGoogleSignIn} variant="danger">Google SignIn</Button>
        <p>{error}</p>
        <Button variant="primary" type="submit">
          {registered ? 'Log-In' : 'Register'}
        </Button>
      </Form>
    </div>
  );
}

export default App;
