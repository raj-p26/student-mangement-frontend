import React, { useEffect, useRef, useState } from "react";
import "../styles/view.css";
// import html2canvas from "html2canvas";
import { BASE_URL } from "../utils/config";
import { DocHeader } from "../Component/DocHeader";
import { Header } from "../Component/Header";
import DocFooter from "../Component/DocFooter";
import { safeFetch } from "../utils";
import { useNavigate, useSearchParams } from "react-router-dom";
import { STREAM_ACRONYMS } from "../utils/constants";
import html2canvas from "html2canvas";
import { Loading } from "../Component/Loading";

export function ViewFirstTrial() {
  const INSTITUTE_TYPE = localStorage.getItem("token");
  const [student, setStudent] = useState({});
  const [serial, setSerial] = useState(0);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [queryParams] = useSearchParams();
  const studentID = queryParams.get("id");

  const getData = async () => {
    try {
      let [resp, err] = await safeFetch(`${BASE_URL}/students/id/${studentID}`);
      if (err) throw new Error(err);
      setStudent({ ...resp.student });

      [resp, err] = await safeFetch(`${BASE_URL}/last-serial/bonafide`);
      if (err) throw new Error(err);
      setSerial((Number(resp.serial) || 0) + 1);
    } catch (e) {
      alert("Some error occured");
      throw new Error(e);
    }
  };

  useEffect(() => {
    document.title = "First-Trial Document";
    getData();
    setLoading(false);

    // eslint-disable-next-line
  }, []);
  const currentYear = new Date().getFullYear();

  const FT_PREFIX = `FT-${INSTITUTE_TYPE}-${STREAM_ACRONYMS[student.stream]}-`;

  const documentRef = useRef(null);
  const navigate = useNavigate();

  const handleDownload = async () => {
    const docName = FT_PREFIX + serial.toString() + ".png";
    setDownloading(true);
    const canvas = await html2canvas(documentRef.current);

    canvas.toBlob((blob) => {
      fetch(`${BASE_URL}/last-serial`, {
        method: "POST",
        headers: {
          doc_type: "first-trial",
          uuid: student.id,
          docname: docName,
        },
      });

      let data = new FormData();
      data.append("doc", blob, docName);

      fetch(`${BASE_URL}/upload-doc`, {
        body: data,
        method: "POST",
        headers: {
          uuid: student.id,
        },
        uuid: student.id,
      })
        .then((res) => res.json())
        .then(console.log);
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = docName;
      a.click();

      setDownloading(false);
      navigate(-1);
    });
  };

  if (loading || !student) return <Loading />;

  return (
    <>
      <Header />
      <div className="justify-content-end d-flex p-4">
        <button
          className="btn btn-primary"
          disabled={downloading}
          onClick={handleDownload}
        >
          Download
        </button>
      </div>

      <div
        className="container p-5 bg-light text-black"
        style={{ height: "297mm", width: "210mm" }}
        ref={documentRef}
      >
        <DocHeader
          title={"FIRST TRIAL CERTIFICATE"}
          serialNo={`Serial No: ${serial}`}
        />

        <div className="p-5">
          <p className="text-center">This is to certify that,</p>
          <p className="h6">
            Mr./Ms.&nbsp;
            <abbr title="attribute ">
              {`${student.surname} ${student.name} ${student.fathername}`}&nbsp;
            </abbr>
            &nbsp;
          </p>
          <p>
            &emsp; &emsp; &emsp; &emsp; &emsp; In Year&nbsp;
            <span className="h6 fw-bold">
              {currentYear}-{(currentYear + 1) % 100}
            </span>
            , was studying <span className="h6 fw-bold">{"MSCIT"}</span> in this
            college. Examination of <span className="h6 fw-bold"> {"BCA"}</span>
            &nbsp;held in&nbsp;
            <span className="h6 fw-bold">
              {"March"}-{"2024"}&nbsp;
            </span>
            was completed by them in first attempt.
          </p>
        </div>
        <DocFooter />
      </div>
    </>
  );
}
