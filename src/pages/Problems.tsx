import {
  Badge,
  Col,
  Container,
  ListGroup,
  Row,
  Spinner,
} from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../styles/problems.css";
import { useEffect, useState, useCallback } from "react";
import axios, { AxiosError } from "axios";
import { Issue } from "../types";
import { searchIssuesByFlowURL } from "../hooks/urls";

type Props = {};

function Product({}: Props) {
  const navigate = useNavigate();
  const params = useParams();

  const [issues, setIssues] = useState<Issue[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const handleProductClick = (issueId: number) => {
    navigate(`/problem/${issueId}/${params.flow}`);
  };

  // La función de fetch ahora solo depende de params.flow.
  // Es más "pura" y no se recrea con cada cambio de `loading`.
  const fetchIssues = useCallback(
    async (currentPage: number, append: boolean = false) => {
      setLoading(true);
      setError(null);
      try {
        const url = `${searchIssuesByFlowURL(
          params.flow || ""
        )}?page=${currentPage}&limit=20`;
        const response = await axios.get<Issue[]>(url);
        const newIssues = response.data;
        setIssues((prevIssues) => {
          if (!append) {
            return newIssues;
          }
          const existingIds = new Set(
            prevIssues.map((issue) => issue.equipmentsIssuesId)
          );
          const uniqueNewIssues = newIssues.filter(
            (issue) => !existingIds.has(issue.equipmentsIssuesId)
          );
          return [...prevIssues, ...uniqueNewIssues];
        });
        setHasMore(newIssues.length > 0);
      } catch (e) {
        const axiosError = e as AxiosError;
        console.error("Error fetching issues:", axiosError.message);
        setError("Failed to load issues. Please check your API connection.");
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [params.flow]
  );

  // useEffect que se encarga de la carga inicial y de las siguientes páginas.
  // Se activa solo por cambios en `page` o `params.flow`.
  useEffect(() => {
    if (params.flow && page === 1) {
      setIssues([]);
      setHasMore(true);
      fetchIssues(1, false);
    } else if (params.flow && page > 1 && hasMore) {
      fetchIssues(page, true);
    }
  }, [page, params.flow, hasMore, fetchIssues]);

  // useEffect que se encarga exclusivamente de la detección del scroll.
  // Su única responsabilidad es llamar a `setPage`.
  const handleScroll = useCallback(() => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 200) {
      if (!loading && hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    }
  }, [loading, hasMore]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // --- Renderizado Condicional Final ---

  if (error) {
    return <p className="text-center mt-4 text-danger">{error}</p>;
  }

  if (issues.length === 0 && loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  if (issues.length === 0 && !loading) {
    return <p className="text-center mt-4">No se encontraron problemas.</p>;
  }

  return (
    <div className="app-wrapper">
      <div className="top-bar">
        <h2 className="title" style={{ margin: 0 }}>
          Problems
        </h2>
      </div>
      <Container className="app-container">
        <Row className="justify-content-center">
          <Col md={8} className="mb-3">
            <ListGroup>
              {issues.map((p) => (
                <ListGroup.Item
                  key={p.equipmentsIssuesId}
                  as="li"
                  className="d-flex justify-content-between align-items-start"
                  action
                  variant="primary"
                  onClick={() => handleProductClick(p.equipmentsIssuesId)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="ms-2 me-auto">
                    <div className="fw-bold">
                      {p.equipmentNumber}{" "}
                      <label style={{ fontWeight: "normal" }}>
                        {p.equipmentName}
                      </label>
                    </div>
                    <label style={{ fontWeight: "bold" }}>
                      {p.priorityIssue}
                    </label>
                    {": "}
                    <label style={{ fontWeight: "normal" }}>
                      {p.typeIssue}
                      {" - "}
                      {p.equipmentsIssuesId}
                    </label>
                  </div>
                  <Badge
                    bg={
                      p.flow === "Pending"
                        ? "danger"
                        : p.flow === "In Progress"
                        ? "secondary"
                        : "success"
                    }
                  >
                    {p.flow}
                  </Badge>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
        </Row>
      </Container>
      <div className="bottom-bar">
        <div className="d-flex flex-column align-items-center">
          {loading && issues.length > 0 && (
            <Spinner animation="border" role="status" className="my-2" />
          )}
          {!loading && !hasMore && issues.length > 0 && (
            <p className="text-center my-2">
              Has llegado al final de la lista.
            </p>
          )}
          <Link to="/" className="btn btn-primary" role="button">
            Go Back
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Product;
