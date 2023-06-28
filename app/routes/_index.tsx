import type { V2_MetaFunction } from "@remix-run/node";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Bearmentor" },
    {
      name: "description",
      content: "Blazing fast mentoring platform for people and organization.",
    },
  ];
};

export default function Index() {
  return (
    <main>
      <h1>Bearmentor</h1>
      <p>Blazing fast mentoring platform for people and organization.</p>
    </main>
  );
}
