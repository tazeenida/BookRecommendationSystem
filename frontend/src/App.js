import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  ListGroup,
  ListGroupItem,
} from "reactstrap";
import classnames from "classnames"; // Corrected the import
import BookModal from "./components/BookModal";
import AddBookForm from "./components/AddBookForm"; // Correct import
import DeleteBookForm from "./components/DeleteBookForm";
import "./App.css"; // Correct path

const App = () => {
  const [bookList, setBookList] = useState([]); // List of books
  const [activeItem, setActiveItem] = useState({}); // Active book
  const [modal, setModal] = useState(false); // Modal state
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error handling
  const [activeTab, setActiveTab] = useState("1"); // Active tab

  const fetchBooks = async () => { // Function to fetch books
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get("/api/BookRec/");
      setBookList(response.data);
    } catch (error) {
      console.error("Error fetching books:", error);
      setError("Error fetching books");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(); // Fetch books on component mount
  }, []);

  const handleBookClick = (book) => {
    setActiveItem(book);
    setModal(true);
  };

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  return (
    <div className="container">
      <h1>BookRec</h1>
      <Nav tabs >
        <NavItem >
          <NavLink
            className={classnames({ active: activeTab === "1" })}
            onClick={() => toggle("1")} id="tabs"
          >
            All Books
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === "2" })}
            onClick={() => toggle("2")} id="tabs"
          >
            Add Book
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === "3" })}
            onClick={() => toggle("3")} id="tabs"
          >
            Search Book
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === "4" })}
            onClick={() => toggle("4")} 
          >
            Delete Book
          </NavLink>
        </NavItem>
      </Nav>

      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
          {isLoading && <p>Loading books...</p>}
          {error && <p>Error fetching books: {error.message}</p>}
          <ul className="list-group list-group-flush border-top-0">
            {bookList.map((item) => (
              <li
                key={item.id}
                className="list-group-item"
                onClick={() => handleBookClick(item)}
              >
                {item.title} by {item.authors}
              </li>
            ))}
          </ul>
        </TabPane>

        <TabPane tabId="2">
        <AddBookForm onBookAdded={fetchBooks} />
        </TabPane>
        <TabPane tabId="3">
          <Form>
            <FormGroup>
              <Label for="filterTerm">Filter Title</Label>
              <Input type="text" name="filterTerm" id="filterTerm" placeholder="Enter book title" />
            </FormGroup>
            <FormGroup>
              <Label for="filterTerm">Filter By rating</Label>
              <Input type="text" name="filterTerm" id="filterTerm" placeholder="Enter rating" />
            </FormGroup>
            <Button color="primary">Filter Books</Button>
          </Form>
        </TabPane>
      
      <TabPane tabId="4">
      <DeleteBookForm/>
        </TabPane>
        </TabContent>
      <BookModal
        isOpen={modal}
        toggle={() => setModal(false)}
        activeItem={activeItem}
      />
    </div>
  );
};

export default App;
