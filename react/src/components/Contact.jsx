import React, { useState } from 'react';


const Contact = () => {
  // State to manage form inputs
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  // State to handle submission status
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Handle input changes dynamically
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Input changed: ${name} = ${value}`);
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Process form data here (e.g., API call to your backend or email service)
    console.log('Form Submitted successfully:', formData);
    
    // Show success message and clear form
    setIsSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });

    // Hide success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <>
  
    <div style={styles.container}>
      <h2 style={styles.heading}>Get in Touch</h2>
      <p style={styles.subheading}>We'd love to hear from you. Please fill out the form below.</p>
      
      {isSubmitted && (
        <div style={styles.successMessage}>
          Thank you! Your message has been sent successfully.
        </div>
      )}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="name" style={styles.label}>Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={styles.input}
            placeholder="Your Name"
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="email" style={styles.label}>Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={styles.input}
            placeholder="your.email@example.com"
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="subject" style={styles.label}>Subject</label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            style={styles.input}
            placeholder="How can we help?"
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="message" style={styles.label}>Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows="5"
            style={{ ...styles.input, ...styles.textarea }}
            placeholder="Write your message here..."
          />
        </div>

        <button type="submit" style={styles.button}>Send Message</button>
      </form>
    </div>
    </>
  );
};

// Basic clean styling using JS objects
const styles = {
  container: {
    maxWidth: '600px',
    margin: '2rem auto',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    backgroundColor: '#ffffff',
    fontFamily: 'Arial, sans-serif'
  },
  heading: {
    textAlign: 'center',
    marginBottom: '0.5rem',
    color: '#333'
  },
  subheading: {
    textAlign: 'center',
    color: '#666',
    marginBottom: '2rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  label: {
    fontWeight: 'bold',
    color: '#444',
    fontSize: '0.9rem'
  },
  input: {
    padding: '0.75rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s',
    color: '#333'
  },
  textarea: {
    resize: 'vertical'
  },
  button: {
    padding: '0.75rem',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  successMessage: {
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '1.5rem',
    textAlign: 'center',
    fontWeight: '500'
  }
};

export default Contact;