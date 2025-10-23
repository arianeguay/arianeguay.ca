import Container from "apps/website/src/components/layout/container";

export default function NotFound() {
  return (
    <Container isScreen background="gradient1">
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-bold mb-4" style={{ textAlign: "center" }}>
          Page not found
        </h1>
        <p className="text-muted-foreground" style={{ textAlign: "center" }}>
          The requested page could not be found.
        </p>
      </div>
    </Container>
  );
}
