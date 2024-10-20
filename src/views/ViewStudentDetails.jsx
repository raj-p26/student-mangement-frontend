import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "../Component/Header";
import { BASE_URL } from "../utils/config";
import { safeFetch } from "../utils";
import { handleError } from "../utils";
import { Loading } from "../Component/Loading";

export function ViewStudentDetails() {
  useEffect(() => {
    document.title = "Student Details";
  });

  const [isLoading, setIsLoading] = useState(true);
  // eslint-disable-next-line
  //const [student, setStudent] = useState({});
  // const [firstTrial, setFirstTrial] = useState(false);
  // const [tc, setTc] = useState(false);
  // const [noObjection, setNoObjection] = useState(false);
  // const [bonafide, setBonafide] = useState(false);
  const [docs, setDocs] = useState({
    bonafide: "",
    transfer_certificate: "",
    first_trial: "",
    no_objection: "",
  });

  const params = useParams();
  const studentID = params.id;

  useEffect(() => {
    async function callAPI() {
      let [resp, err] = await safeFetch(
        `${BASE_URL}/students/${studentID}/docs`
      );
      handleError(err);
      setDocs({ ...resp.documents });
      console.log(resp.documents);

      // [resp, err] = await safeFetch(
      //   `http://${SERVER_HOST}:${SERVER_PORT}/students/${params.id}/has/first-trial`
      // );
      // handleError(err);
      // setFirstTrial(resp.exists);

      // [resp, err] = await safeFetch(
      //   `http://${SERVER_HOST}:${SERVER_PORT}/students/${params.id}/has/bonafide`
      // );
      // handleError(err);
      // setBonafide(resp.exists);

      // [resp, err] = await safeFetch(
      //   `http://${SERVER_HOST}:${SERVER_PORT}/students/${params.id}/has/tc`
      // );
      // handleError(err);
      // setTc(resp.exists);

      // [resp, err] = await safeFetch(
      //   `http://${SERVER_HOST}:${SERVER_PORT}/students/${params.id}/has/no-objection`
      // );
      // handleError(err);
      // setNoObjection(resp.exists);

      setIsLoading(false);
    }

    callAPI();
    // eslint-disable-next-line
  }, []);

  // let navigate = useNavigate();

  // eslint-disable-next-line
  // const handleClick = () => {
  //   if (student) {
  //     localStorage.setItem("update-details", JSON.stringify(student));
  //     navigate("/admissionForm");
  //   }
  // };

  return (
    <>
      <Header />
      {isLoading ? (
        <Loading />
      ) : (
        <div className="container p-3">
          <div className="row g-3 justify-content-center d-flex align-items-center flex-column">
            {!docs.transfer_certificate && (
              <div className="w-50">
                <Link
                  to={`/tcdoc?id=${params.id}`}
                  role="button"
                  className="btn btn-primary w-100"
                >
                  Leaving Certificate
                </Link>
              </div>
            )}

            {!docs.no_objection && (
              <div className="w-50">
                <Link
                  to={`/noObjdoc?id=${params.id}`}
                  role="button"
                  className="btn btn-primary w-100"
                >
                  No Objection Certificate
                </Link>
              </div>
            )}

            {!docs.bonafide && (
              <div className="w-50">
                <Link
                  to={`/bonafidedoc?id=${params.id}`}
                  role="button"
                  className="btn btn-primary w-100"
                >
                  Bonafide Certificate
                </Link>
              </div>
            )}

            {!docs.first_trial && (
              <div className="w-50">
                <Link
                  to={`/firsttrialdoc?id=${params.id}`}
                  role="button"
                  className="btn btn-primary w-100"
                >
                  First Trial Certificate
                </Link>
              </div>
            )}
            <div className="w-50">
              <Link
                to={`/UpdateStudent?id=${params.id}`}
                role="button"
                className="btn btn-primary w-100"
              >
                Update Student
              </Link>
            </div>
            <div className="w-50">
              <Link
                to={`/update-img/${params.id}`}
                role="button"
                className="btn btn-primary w-100"
              >
                Update Image
              </Link>
            </div>
          </div>
          {docs.transfer_certificate && (
            <div className="img-holder mx-auto w-50 mt-4">
              <img
                src={`${BASE_URL}/uploads/${studentID}/${docs.transfer_certificate}`}
                alt="transfer certificate"
                className="w-100"
              />
            </div>
          )}
          {docs.bonafide && (
            <div className="img-holder mx-auto w-50 mt-4">
              <img
                src={`${BASE_URL}/uploads/${studentID}/${docs.bonafide}`}
                alt="bonafide"
                className="w-100"
              />
            </div>
          )}
          {docs.first_trial && (
            <div className="img-holder mx-auto w-50 mt-4">
              <img
                src={`${BASE_URL}/uploads/${studentID}/${docs.first_trial}`}
                alt="first trial"
                className="w-100"
              />
            </div>
          )}
          {docs.no_objection && (
            <div className="img-holder mx-auto w-50 mt-4">
              <img
                src={`${BASE_URL}/uploads/${studentID}/${docs.no_objection}`}
                alt="no objection"
                className="w-100"
              />
            </div>
          )}
        </div>
      )}
    </>
  );
}
