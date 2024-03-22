
export default function Page({ params }: { params: { slug: string } }) {
  return (
    <div>
      <p>This is seller page</p>
      <p>{params.slug} is also a slug</p>
    </div>
  );
}
