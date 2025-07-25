import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import html2canvas from "html2canvas";
import { DocHeader, Header, DocFooter } from "../Component";
import { SERVER_HOST, SERVER_PORT } from "../utils/config";
import "../styles/view.css";

export function ViewTc() {
  useEffect(() => {
    document.title = "Transfer Certificate";
  });
  const [searchparam] = useSearchParams();
  const currentDate = new Date();
  const student = JSON.parse(localStorage.getItem("tc-info"));
  const documentRef = useRef(null);
  if (student == null) {
    alert("Student is empty");
  }
  const navigate = useNavigate();

  console.log(searchparam.has("save"));
  const handleDownload = () => {
    html2canvas(documentRef.current).then((canvas) => {
      canvas.toBlob((blob) => {
        // if (searchparam.has("save")) {
        let data = new FormData();
        data.append("doc", blob, student.docName);

        fetch(`http://${SERVER_HOST}:${SERVER_PORT}/last-serial`, {
          method: "POST",
          headers: {
            doc_type: "tc",
            uuid: student.uuid,
            docname: student.docName,
          },
        });

        fetch(`http://${SERVER_HOST}:${SERVER_PORT}/upload-doc`, {
          body: data,
          method: "POST",
          headers: {
            uuid: student.uuid,
          },
          uuid: student.uuid,
        })
          .then((res) => res.json())
          .then(console.log);
        // }
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = student.docName;

        a.click();

        navigate(-2);
        localStorage.removeItem("tc-info");
      });
    });
  };

  return (
    <>
      <Header />
      <div className="justify-between p-4">
        <button
          className="text-center border text-xl rounded py-1 bg-blue-600 text-white hover:bg-blue-700  block mx-auto"
          onClick={handleDownload}
        >
          Download
        </button>
      </div>
      <div className="flex justify-center">
        <div
          className=" p-5 border border-black"
          style={{ height: "297mm", width: "210mm" }}
          ref={documentRef}
        >
          <DocHeader
            title={"TRANSFER CERTIFICATE"}
            serialNo={`TC No: ${student.tcSerial}`}
          />
          <div className="p-5">
            <p>
              &emsp; &emsp; &emsp; &emsp; This is to certify to that, Mr./Ms.
              <span className="h6 fw-bold">
                {" "}
                <abbr title="attribute"> {student.studentName}</abbr>
              </span>{" "}
              was the student of this college.
            </p>
            <br />
            <ol className="m-0 list-disc space-y-2">
              <li>
                He/She gave exam of{" "}
                <span className="h6 fw-bold">
                  {student.stream} sem {student.semester}
                </span>{" "}
                in year <span className="h6 fw-bold">{student.examyear}</span>{" "}
                <br />
                <span className="h6 fw-bold">
                  {student.start_date} to {student.end_date}.
                </span>
                <br />
              </li>
              <li>
                As a student of this college he/she has{" "}
                <span className="h6 fw-bold">{student.result}</span>
                <span className="h6 fw-bold">{student.lastexam}</span> exam in{" "}
                <span className="h6 fw-bold">
                  {student.exam_month} - {student.examyear}
                </span>{" "}
                but got exam exemption in
                <span className="h6 fw-bold"> {student.no_pass_subject} </span>
                Subjects.
              </li>
              <li>
                He/she Would have been on{" "}
                <span className="h6"> {student.next_study}</span> if his/her
                education was continued.
              </li>
              <li>He/She does not have debts of this college's books. </li>
              <li>He/She does not have any other debts of this college.</li>
              <li>His/Her behavior is good.</li>
              <li>His/Her Optional subjects were as given below.</li>

              <li>
                The University has satisfactorily completed the prescribed
                course of exercises. He/She was given medical reasons/N.C.C.
                member Exempted from exercise.
              </li>
              <li>
                His/Her Enrollment/Eligibility Certificate/T.C. Number{" "}
                <span className="h6 fw-bold"> TC.No.{student.tcSerial} </span>as
                of date{" "}
                <span className="h6 fw-bold">
                  {" "}
                  {currentDate.getDate() +
                    "/" +
                    currentDate.getMonth() +
                    "/" +
                    currentDate.getFullYear()}
                  .
                </span>
              </li>
              <li>
                His/Her Examination of{" "}
                <span className="h6">
                  {student.lastexam} sem- {student.semester}
                </span>{" "}
                seat number <span className="h6 fw-bold">{student.seatno}</span>
                . Result <span className="h6 fw-bold">{student.result}</span>.
              </li>
              <li>
                They are not debarred or rusticated by university or college.
              </li>
              <li>Note:(Inform about EBC-CB & other scholarship).</li>
            </ol>
            <p className="m-0">
              The Principal/The General Secretary To{" "}
              <span className="h6 fw-bold">{student.nameofhead}</span>{" "}
              college/university.
            </p>
            <br />
            <br />
            <br />
            <br />
            <DocFooter />
          </div>
        </div>
      </div>
    </>
  );
}
