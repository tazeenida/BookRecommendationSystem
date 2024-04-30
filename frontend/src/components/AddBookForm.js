import React, { useState } from "react";
import axios from "axios";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import { v4 as uuidv4 } from 'uuid'; 

const AddBookForm = () => {
  const [bookData, setBookData] = useState({
    book_id: uuidv4(),
    title: "",
    year: "",
    pages: "",
    description: "",
    genres: "",
    average_rating: "",
    ratings_count: "",
    authors: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookData({ ...bookData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post("/api/BookRec/add/", bookData);  // Ensure book_id is in bookData
      console.log("Book added:", response.data.message);
    } catch (error) {
      console.error("Error adding book:", error.response?.data);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label for="bookId">Book ID</Label>
        <Input
          type="text"
          name="book_id"
          value={bookData.book_id}
          onChange={handleInputChange}
          readOnly // Make the field read-only to prevent manual edits
          placeholder="Book ID (auto-generated)"
        />
      </FormGroup>
      <FormGroup>
        <Label for="bookTitle">Book Title</Label>
        <Input
          type="text"
          name="title"
          value={bookData.title}
          onChange={handleInputChange}
          placeholder="Enter book title"
        />
      </FormGroup>

      <FormGroup>
        <Label for="bookAuthor">Authors</Label>
        <Input
          type="text"
          name="authors"
          value={bookData.authors}
          onChange={handleInputChange}
          placeholder="Enter authors"
        />
      </FormGroup>

      <FormGroup>
        <Label for="bookYear">Year</Label>
        <Input
          type="number"
          name="year"
          value={bookData.year}
          onChange={handleInputChange}
          placeholder="Enter book year"
        />
      </FormGroup>

      <FormGroup>
        <Label for="bookPages">Pages</Label>
        <Input
          type="number"
          name="pages"
          value={bookData.pages}
          onChange={handleInputChange}
          placeholder="Enter book pages"
        />
      </FormGroup>

      <FormGroup>
        <Label for="bookDescription">Description</Label>
        <Input
          type="text"
          name="description"
          value={bookData.description}
          onChange={handleInputChange}
          placeholder="Enter description"
        />
      </FormGroup>

      <FormGroup>
        <Label for="bookGenres">Genres</Label>
        <Input
          type="text"
          name="genres"
          value={bookData.genres}
          onChange={handleInputChange}
          placeholder="Enter genres"
        />
      </FormGroup>

      <FormGroup>
        <Label for="bookAvgRating">Average Rating</Label>
        <Input
          type="number"
          name="average_rating"
          value={bookData.average_rating}
          onChange={handleInputChange}
          placeholder="Enter average rating"
        />
      </FormGroup>

      <FormGroup>
        <Label for="bookRatingsCount">Ratings Count</Label>
        <Input
          type="number"
          name="ratings_count"
          value={bookData.ratings_count}
          onChange={handleInputChange}
          placeholder="Enter ratings count"
        />
      </FormGroup>

      <Button color="primary" type="submit">
        Add Book
      </Button>
    </Form>
  );
};

export default AddBookForm;
