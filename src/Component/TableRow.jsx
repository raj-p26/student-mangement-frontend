import { Link } from "react-router-dom";

export function TableRow({ data }) {
  const INSTITUTE_TYPE = localStorage.getItem("token");
  const GIA_COls = [
    "main_course",
    "first_secondary_subject",
    "tertiary_secondary_subject",
    "elective_course",
  ];

  const fields = [];
  Object.entries(data).forEach(([k, v]) => {
    if (INSTITUTE_TYPE !== "GIA" && GIA_COls.includes(k)) return;
    if (k === "id") return;

    fields.push(<td key={k}>{v || "None"}</td>);
  });

  return (
    <tr>
      {fields.map((e) => e)}
      <td>
        <Link to={`/students/${data.id}`}>View Details &rarr;</Link>
      </td>
    </tr>
  );
}
