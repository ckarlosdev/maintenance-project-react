import { useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  Card,
  Col,
  Container,
  FloatingLabel,
  Form,
  Modal,
  Row,
  ToggleButton,
} from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { Issue } from "../types";
import { searchIssueByIdURL } from "../hooks/urls";
import useHttpData from "../hooks/useHttpData";
import "../styles/problemsDetails.css";
import useMain from "../hooks/useMain";

type Props = {};

function ProblemDetail({}: Props) {
  const params = useParams();
  const [radioValue, setRadioValue] = useState("1");
  const [issueSelected, setIssueSelected] = useState<Issue | undefined>();
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [modalComment, setModalComment] = useState("");
  const [selectedFlowForModal, setSelectedFlowForModal] = useState<
    string | undefined
  >(undefined);

  const users = [
    "Thomas	Gildemeister",
    "Madeline Brandt",
    "Michael	Hoeppner",
    "Steven	Barnekow",
    "Donovan	Curci",
  ];

  const [selectedUser, setSelectedUser] = useState<string>(users[0] || "");

  const radios = [
    { name: "Pending", value: "1" },
    { name: "In Progress", value: "2" },
    { name: "Fixed", value: "3" },
  ];

  const { data: issueData, error, search: searchIssue } = useHttpData<Issue>();
  const { updateIssue } = useMain();

  const handleCloseSuccessModal = () => setShowSuccessModal(false);
  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal(false);
    setModalComment("");
    setSelectedFlowForModal(undefined);
    setSelectedUser(users[0] || "");
  };

  const handleConfirmSave = async () => {
    // console.log("flow", flowData);
    if (!issueSelected || !selectedFlowForModal) {
      console.error(" issueSelected is undefined.");
      return;
    }

    if (!selectedUser) {
      alert("Please select a user to confirm the change.");
      return;
    }

    const updatedIssueData: Issue = {
      ...issueSelected,
      flow: selectedFlowForModal,
      comments: modalComment,
      updatedBy: selectedUser,
    };

    setIsSaving(true);
    setShowConfirmationModal(false);

    try {
      if (updatedIssueData && params.id) {
        await updateIssue(updatedIssueData);
        setShowSuccessModal(true);
        searchIssue(searchIssueByIdURL(params.id));
      } else {
        console.log("no saved");
      }
    } catch (error: any) {
      console.error("Saving error:", error);
    } finally {
      setIsSaving(false);
      setModalComment(""); // Limpiar el comentario
      setSelectedFlowForModal(undefined);
      setSelectedUser(users[0] || "");
    }
  };

  const handleRadioToggleChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newRadioValue = e.currentTarget.value;
    setRadioValue(newRadioValue); // Actualiza el estado del radio button

    // Encuentra el nombre del flujo correspondiente al valor seleccionado
    const selectedRadio = radios.find((r) => r.value === newRadioValue);
    if (selectedRadio) {
      setSelectedFlowForModal(selectedRadio.name); // Guarda el nombre del flujo para el modal
      setShowConfirmationModal(true); // Abre el modal de confirmación
    }
  };

  useEffect(() => {
    if (params.id) {
      const url = searchIssueByIdURL(params.id);
      searchIssue(url);
    }
  }, []);

  useEffect(() => {
    if (issueData) {
      setIssueSelected(issueData);

      const radioIndex = radios.findIndex(
        (radio) => radio.name === issueData.flow
      );
      // console.log(radioIndex);
      if (radioIndex !== -1) {
        setRadioValue(radios[radioIndex].value);
      }
    }
  }, [issueData, radios]);

  if (!issueSelected) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // console.log("details", issueSelected);

  return (
    <div className="app-wrapper">
      <Container>
        <Row className="justify-content-center">
          <h2
            style={{ textAlign: "center", fontWeight: "bold" }}
            className="mb-3"
          >
            Problem Details
          </h2>
        </Row>
        <Row className="justify-content-center">
          <Col md={8} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title style={{ textAlign: "center" }} className="mb-3">
                  {issueSelected?.equipmentNumber} -{" "}
                  {issueSelected?.equipmentName}
                </Card.Title>
                <Card.Subtitle
                  className="mb-2 text-muted"
                  style={{ textAlign: "center" }}
                >
                  <Form.Label>Reported By:</Form.Label>{" "}
                  <Form.Label style={{ fontWeight: "bold" }}>
                    {issueSelected?.reportedBy}
                  </Form.Label>
                  <br />
                  <Form.Label>Reported Date:</Form.Label>{" "}
                  <Form.Label style={{ fontWeight: "bold" }}>
                    {issueSelected?.reportedDate}
                  </Form.Label>
                </Card.Subtitle>
                <div className="mt-3">
                  <Form.Control
                    type="text"
                    placeholder="Leave a comment here"
                    value={"Priority: " + issueSelected?.priorityIssue}
                    className="mb-3"
                    readOnly
                  />
                  <Form.Control
                    type="text"
                    placeholder="Leave a comment here"
                    value={"Type: " + issueSelected?.typeIssue}
                    className="mb-3"
                    readOnly
                  />
                  <FloatingLabel
                    controlId="floatingTextarea2"
                    label="Description"
                    className="mb-3"
                  >
                    <Form.Control
                      as="textarea"
                      placeholder="Leave a comment here"
                      value={issueSelected?.descriptionIssue}
                      style={{ height: "100px" }}
                      readOnly
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
                      value={issueSelected?.details}
                      readOnly
                    />
                  </FloatingLabel>
                </div>
                <ButtonGroup className="w-100">
                  {radios.map((radio, idx) => {
                    let variantColor;

                    // Asignamos el color del variant según el índice
                    if (idx === 0) {
                      variantColor = "outline-danger";
                    } else if (idx === 1) {
                      variantColor = "outline-secondary";
                    } else if (idx === 2) {
                      variantColor = "outline-success";
                    } else {
                      // Opcional: un color por defecto para los demás botones
                      variantColor = "outline-primary";
                    }

                    return (
                      <ToggleButton
                        key={idx}
                        id={`radio-${idx}`}
                        type="radio"
                        variant={variantColor} // Usamos la variable con el color
                        name="radio"
                        value={radio.value}
                        checked={radioValue === radio.value}
                        onChange={handleRadioToggleChange}
                      >
                        {radio.name}
                      </ToggleButton>
                    );
                  })}
                </ButtonGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col xs="auto">
            <Link
              to={`/problems/${params.flow}`}
              style={{ textAlign: "center", fontWeight: "bold" }}
              className="btn btn-primary"
              role="button"
            >
              Go Back
            </Link>
          </Col>
        </Row>
      </Container>

      <Modal show={showConfirmationModal} onHide={handleCloseConfirmationModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm flow</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure change to "
          <span style={{ fontWeight: "bold" }}>{selectedFlowForModal}</span>
          "?
          <Form.Group controlId="formUserSelect" className="mt-3">
            <Form.Label>Seleccionar Usuario</Form.Label>
            <Form.Select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              required
            >
              <option value="">Select user...</option>
              {users.map((user, idx) => (
                <option key={idx} value={user}>
                  {user}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <FloatingLabel
            controlId="floatingTextareaComment"
            label="Add Comment (Optional)"
            className="mt-3"
          >
            <Form.Control
              as="textarea"
              placeholder="Whrite a comment here..."
              style={{ height: "80px" }}
              value={modalComment}
              onChange={(e) => setModalComment(e.currentTarget.value)}
            />
          </FloatingLabel>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseConfirmationModal}>
            Cancel
          </Button>
          <Button
            variant="success"
            onClick={handleConfirmSave}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showSuccessModal} onHide={handleCloseSuccessModal}>
        <Modal.Header closeButton>
          <Modal.Title>Data Updated</Modal.Title>
        </Modal.Header>
        <Modal.Body>The issue data has been updated successfully!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseSuccessModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ProblemDetail;
