import React, { useState } from "react";
import axios from "axios";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";

function UpdateBookForm({ onBookUpdated }) {
  const [bookData, setBookData] = useState({
    book_id: '', 
    title: '',
    year: '',
    pages: '',
    description: '',
    genres: '',
    average_rating: '',
    ratings_count: '',
    authors: ''
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      const response = await axios.put("/api/BookRec/update/", bookData); // Correct endpoint
      if (response.status === 200) {
        // Handle successful update
        setModalTitle("Book Updated");
        setModalMessage(`"${bookData.title}" was successfully updated.`);
        toggleModal();
        setTimeout(() => {
          if (onBookUpdated) {
            onBookUpdated(); // Trigger callback to refresh the book list
          }
        }, 2000);
      } else {
        setModalTitle("Update Failed");
        setModalMessage("Failed to update the book.");
        toggleModal();
      }
    } catch (error) {
      setModalTitle("Error updating Book");
      setModalMessage("An error occurred while updating the book. Please try again.");
      toggleModal();
      console.error("Error updating book:", error.response?.data);
    }
  };
  

  return (
    <div>
      <h2>Update Book</h2>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Book ID:</Label>
          <Input
            type="text"
            name="book_id"  // Ensure this is consistent with the backend
            value={bookData.book_id}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Title:</Label>
          <Input
            type="text"
            name="title"
            value={bookData.title}
            onChange={handleChange}
          />
        </FormGroup>
        <Button type="submit">Update</Button>
      </Form>
    </div>
  );
}

export default UpdateBookForm;
