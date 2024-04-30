import axios from "axios";
import React, { useState } from "react";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import FeedbackModal from "./FeedbackModal";

const DeleteBookForm = () => {
  const [bookTitle, setBookTitle] = useState(""); // State to hold book title
  const [bookAuthors, setBookAuthors] = useState(""); // State to hold book authors
  
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [modalTitle, setModalTitle] = useState(""); // Modal title
  const [modalMessage, setModalMessage] = useState(""); // Modal message
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form behavior

    try {
      const response = await axios.delete("/api/BookRec/delete/", {
        data: { title: bookTitle, authors: bookAuthors },
      });

      if (response.status === 200) { // Status 200 indicates successful deletion
        setModalTitle("Book Deleted"); // Set modal title
        setModalMessage(`"${bookTitle}" was successfully deleted.`); // Set modal message
        toggleModal(); // Open the modal
        
        // Reload the page after a delay to reflect the changes
        setTimeout(() => {
          window.location.reload(); 
        }, 2000); // Wait 2 seconds to let the user see the modal
      } else {
        setModalTitle("Delete Book Failed");
        setModalMessage("Failed to delete the book.");
        toggleModal();
      }
    } catch (error) {
      setModalTitle("Error Deleting Book");
      setModalMessage("An error occurred while deleting the book. Please try again.");
      toggleModal();
    }
  };

  return (
    <>
      <h2>Delete Books</h2>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label for="deleteTitle">Book Title</Label>
          <Input
            type="text"
            name="title"
            value={bookTitle}
            onChange={(e) => setBookTitle(e.target.value)} // Set book title
            placeholder="Enter book title"
          />
        </FormGroup>
        <FormGroup>
          <Label for="deleteAuthors">Book Authors</Label>
          <Input
            type="text"
            name="authors"
            value={bookAuthors}
            onChange={(e) => setBookAuthors(e.target.value)} // Set book authors
            placeholder="Enter book authors"
          />
        </FormGroup>
        <Button color="danger" type="submit">
          Delete Book
        </Button>
      </Form>

      <FeedbackModal
        isOpen={isModalOpen}
        toggle={toggleModal}
        title={modalTitle}
        message={modalMessage}
      />
    </>
  );
};

export default DeleteBookForm;
