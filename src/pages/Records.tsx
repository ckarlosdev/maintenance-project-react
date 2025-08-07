import {
  Accordion,
  Container,
  FloatingLabel,
  Form,
  Row,
} from "react-bootstrap";
import { Link } from "react-router-dom";

type Props = {};

function Records({}: Props) {
  return (
    <Container className="app-container">
      <Row className="justify-content-center">
        <h2 style={{ textAlign: "center", padding: "2rem" }}>Records</h2>
      </Row>
      <Row className="justify-content-center">
        <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="0">
            <Accordion.Header>E50 - Telehandler</Accordion.Header>
            <Accordion.Body>
              <Form.Label>Reported By:</Form.Label>{" "}
              <Form.Label style={{ fontWeight: "bold" }}>
                Carlos Ramirez
              </Form.Label>{" "}
              <Form.Label>Reported Date:</Form.Label>{" "}
              <Form.Label style={{ fontWeight: "bold" }}>8/4/2025</Form.Label>
              <br />
              <Form.Label>Priority:</Form.Label>{" "}
              <Form.Label style={{ fontWeight: "bold" }}>High</Form.Label>
              <br />
              <Form.Label>Type:</Form.Label>{" "}
              <Form.Label style={{ fontWeight: "bold" }}>
                Won't start
              </Form.Label>
              <FloatingLabel
                controlId="floatingTextarea2"
                label="Description"
                className="mb-3"
              >
                <Form.Control
                  as="textarea"
                  placeholder="Leave a comment here"
                  style={{ height: "100px" }}
                />
              </FloatingLabel>
              <FloatingLabel
                controlId="floatingTextarea2"
                label="Detail"
                className="mb-3"
              >
                <Form.Control
                  as="textarea"
                  placeholder="Leave a comment here"
                  style={{ height: "100px" }}
                />
              </FloatingLabel>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>E07 - Skid Loader</Accordion.Header>
            <Accordion.Body>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Row>
      <Row className="justify-content-center">
        <div className="app-wrapper">
          <Link
            to="/"
            style={{ textAlign: "center", fontWeight: "bold" }}
            className="btn btn-primary"
            role="button"
          >
            Go Back
          </Link>
        </div>
      </Row>
    </Container>
  );
}

export default Records;
