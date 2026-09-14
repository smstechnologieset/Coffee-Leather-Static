export default function CoffeeDetailPage({ params }: { params: { slug: string } }) {
  return (
    <main>
      <h1>Coffee: {params.slug}</h1>
      <p>Product detail — coming in Phase 3.</p>
    </main>
  );
}
