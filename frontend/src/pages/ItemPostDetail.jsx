import { useEffect } from "react";
import { Container } from "react-bootstrap";
import useFetch from "../hooks/useFetch";
import { useParams } from "react-router-dom";

export default function ItemPostDetail() {
  const { id } = useParams();
  const { data, isLoading, error } = useFetch(`/api/itempost/${id}/`);
  console.log("data", data);
  console.log("error", error);

  return <Container></Container>;
}
