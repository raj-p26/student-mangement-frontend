import React, { useEffect, useState } from "react";
import { Header } from "../Component/Header";
import { Input } from "../Component/Input";
import { SelectBox } from "../Component/SelectBox";
import { RadioGroup } from "../Component/RadioGroup";
import {
  GIA_STREAMS,
  SEMESTER,
  SFI_STREAMS,
  STREAM_ACRONYMS,
} from "../utils/constants";
import { SERVER_HOST, SERVER_PORT } from "../utils/config";
import { handleError, safeFetch } from "../utils";

function AdmissionForm() {
  //=====
  useEffect(() => {
    document.title = "Admission Form";
  });

  //=====
  const INSTITUTE_TYPE = localStorage.getItem("token");
  const [previewImage, setPreviewImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState({
    stream: "",
    semester: "",
    elective_course: "",
    main_subject: "",
    first_secondary_subject: "",
    tertiary_secondary_subject: "",
    gr_no: "",
    enrollment_no: "",
    abc_id: "",
    udisk_no: "",
    aadhar_number: "",
    surname: "",
    name: "",
    fathername: "",
    father_name: "",
    mother_name: "",
    address: "",
    whatsapp_no: "",
    parent_contact_no: "",
    email: "",
    gender: "",
    birth_date: "",
    birth_place: "",
    caste: "",
    city: "",
    district: "",
    pincode: "",
    studentimg: null,
    last_organization_studied_from: "",
    last_studied_year: "",
    institute_type: INSTITUTE_TYPE,
  });

  const [errors, setErrors] = useState({
    aadharNumber: "",
    mobileNo: "",
    email: "",
    surname: "",
    name: "",
    fatherName: "",
    studentImg: "",
  });

  // eslint-disable-next-line
  const [validForm, setValidForm] = useState(true);

  useEffect(() => {
    if (
      user.stream !== "Bachelor of Arts" ||
      user.stream !== "Bachelor of Commerce"
    ) {
      setUser({
        ...user,
        main_subject: "",
        first_secondary_subject: "",
        tertiary_secondary_subject: "",
        elective_course: "",
      });
    }
    // eslint-disable-next-line
  }, [user.stream]);

  const handleInputs = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleFileUploads = (e) => {
    const name = e.target.name;
    const file = e.target.files[0];

    setPreviewImage(URL.createObjectURL(file));
    setUser({ ...user, [name]: file });
  };

  const isNumber = (value) => !Number(value) === false;

  const handlenumber = (e, max) => {
    let value = e.target.value.trim();
    if ((!isNumber(value) || value.length > max) && value !== "") {
      e.preventDefault();
      return;
    }

    setUser({ ...user, [e.target.name]: value });
  };

  // eslint-disable-next-line
  const [error, setError] = useState({});

  function validate() {
    let errs = {};
    let valid = true;
    if (!user.email.trim()) {
      errs.email = "Email is required!";
      valid = false;
    }

    if (
      !user.email.match(
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      )
    ) {
      errs.email = "Email is not a valid Email!";
      valid = false;
    }

    if (!user.surname.trim()) {
      errs.surname = "Surname is required!";
      valid = false;
    }

    if (!user.name.trim()) {
      errs.name = "Name is required!";
      valid = false;
    }

    if (!user.fathername.trim()) {
      errs.fatherName = "Father name is required!";
      valid = false;
    }

    if (!user.whatsapp_no.trim()) {
      errs.mobileNo = "Whatsapp Number is required!";
      valid = false;
    }

    if (!user.studentimg) {
      errs.studentImg = "Student Image is required!";
      valid = false;
    }

    setErrors(errs);

    return valid;
  }

  // const isValid = () => {
  //   const validationError = {};

  //   if (!user.email.trim()) {
  //     validationError.email = "Email is Required";
  //   } else if (
  //     !user.email.match(
  //       /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  //     )
  //   ) {
  //     validationError.email = "Email is Not Valid";
  //   }
  //   if (!user.name.trim()) {
  //     validationError.name = "Name is Required";
  //   } else if (!user.surname.trim()) {
  //     validationError.name = "Surname is Required";
  //   } else if (!user.fathername.trim()) {
  //     validationError.name = "Fathername is Required";
  //   }
  //   if (!user.whatsapp_no.trim()) {
  //     validationError.whatsapp_no = "WhatsApp Number is Required";
  //   }
  //   if (!user.studentimg) {
  //     validationError.studentimg = "Please Upload Image";
  //   }

  //   setError(validationError);
  //   return Object.keys(validationError).length === 0;
  // };

  const STREAM = STREAM_ACRONYMS;

  const GR_PREFIX = "GR-" + INSTITUTE_TYPE + "-" + STREAM[user.stream] + "-";

  // submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(validate());
    // setValidForm(isValid());
    // if (!validForm) {
    //   setSubmitting(false);
    //   return;
    // }

    let [res, err] = await safeFetch(
      `http://${SERVER_HOST}:${SERVER_PORT}/last-gr/`
    );
    handleError(err);

    const gr = Number(res.gr_no);
    // statelessInc because previous test was with stateful incrementor (used useState, nothing else)
    const statelessInc = gr + 1;

    // setUser({ ...user, gr_no: `${GR_PREFIX}${statelessInc}` });
    user.gr_no = `${GR_PREFIX}${statelessInc}`;

    // console.log(errors);
    // return;

    // eslint-disable-next-line
    if (user.gr_no) {
      const submitData = new FormData();
      Object.entries(user).forEach(([key, value]) => {
        if (user[key] !== null) {
          submitData.append(key, value);
        }
      });

      [res, err] = await safeFetch(
        `http://${SERVER_HOST}:${SERVER_PORT}/students/`,
        {
          method: "POST",
          body: submitData,
        }
      );
      handleError(err);

      if (res.status === "success") {
        alert("record inserted");
        window.location.reload();
      } else {
        alert("see console");
        console.log(res);
        setSubmitting(true);
      }
    }
    setSubmitting(false);
  };

  return (
    <>
      <Header />
      <div className="bg-dark">
        <h2 className="text-center mt-3 text-white">Admission Form</h2>
        <div className="col d-flex justify-content-center py-3">
          <div className="card bg-light" style={{ width: "50rem" }}>
            <form className="m-4" method="post" encType="multipart/form-data">
              <div className="row border-3 form-group mb-3 align-items-center">
                <SelectBox
                  name="stream"
                  onChange={handleInputs}
                  label={"Stream:"}
                  placeholder={"Select Stream"}
                  data={
                    INSTITUTE_TYPE === "GIA"
                      ? [...GIA_STREAMS]
                      : [...SFI_STREAMS]
                  }
                />

                <SelectBox
                  name="semester"
                  onChange={handleInputs}
                  label={"Semester :"}
                  placeholder={"Select Semester"}
                  data={[...SEMESTER]}
                />
              </div>

              {user.stream === "Bachelor of Commerce" && (
                <RadioGroup
                  label={"Choose Subject:"}
                  name={"elective_course"}
                  onChange={handleInputs}
                  data={[
                    { label: "Accountancy", value: "accountancy" },
                    { label: "Computer Science", value: "computer science" },
                  ]}
                  checked={user.elective_course}
                />
              )}

              {user.stream === "Bachelor of Arts" && (
                <RadioGroup
                  label={"Compulsary Subject:"}
                  name={"elective_course"}
                  onChange={handleInputs}
                  data={[
                    { label: "English", value: "english" },
                    { label: "Hindi", value: "hindi" },
                  ]}
                  checked={user.elective_course}
                />
              )}

              <hr />

              {user.stream === "Bachelor of Arts" && (
                <RadioGroup
                  label={"Main Subject:"}
                  name={"main_subject"}
                  onChange={handleInputs}
                  data={[
                    { label: "Economics", value: "economics" },
                    { label: "Gujarati", value: "gujarati" },
                    { label: "Psychology", value: "psychology" },
                    { label: "Hindi", value: "hindi" },
                  ]}
                  checked={user.main_subject}
                />
              )}

              {user.stream === "Bachelor of Arts" && (
                <RadioGroup
                  label={"First Secondary Subject:"}
                  name={"first_secondary_subject"}
                  onChange={handleInputs}
                  data={[
                    { label: "Gujarati", value: "gujarati" },
                    { label: "Hindi", value: "hindi" },
                    { label: "Psychology", value: "psychology" },
                  ]}
                  checked={user.first_secondary_subject}
                />
              )}

              {user.stream === "Bachelor of Arts" && (
                <>
                  <RadioGroup
                    label={"Tertiary Secondary Subject:"}
                    name={"tertiary_secondary_subject"}
                    onChange={handleInputs}
                    data={[
                      { label: "Gujarati", value: "gujarati" },
                      { label: "Hindi", value: "hindi" },
                      { label: "Psychology", value: "psychology" },
                    ]}
                    checked={user.tertiary_secondary_subject}
                  />
                  <hr />
                </>
              )}
              <div className="row border-3 form-group mb-3 align-items-center">
                <Input
                  type="text"
                  name="abc_id"
                  label="ABC ID:"
                  value={user.abc_id}
                  placeholder="Enter ABC ID No."
                  onChange={(e) => handlenumber(e, 12)}
                />

                <Input
                  type="text"
                  name="udisk_no"
                  label="UDISK No:"
                  value={user.udisk_no}
                  placeholder="Enter UDISK No."
                  onChange={handleInputs}
                />
              </div>

              <div className="row border-3 form-group mb-3 align-items-center">
                <Input
                  type="text"
                  name="aadhar_number"
                  label="Aadhar No:"
                  value={user.aadhar_number}
                  placeholder="Enter Aadhar No."
                  max="12"
                  onChange={(e) => handlenumber(e, 12)}
                  required
                />
              </div>

              {error.aadhar_number && (
                <p className="text-danger">{error.aadhar_number}</p>
              )}

              <RadioGroup
                name={"caste"}
                label={"Caste:"}
                onChange={handleInputs}
                data={[
                  { label: "GENERAL", value: "GENERAL" },
                  { label: "EWS", value: "EWS" },
                  { label: "SC", value: "SC" },
                  { label: "ST", value: "ST" },
                  { label: "SEBC(OBC)", value: "SEBC(OBC)" },
                  { label: "PH", value: "PH" },
                  { label: "EX-ARMY", value: "EX-ARMY" },
                ]}
                checked={user.caste}
              />
              <div className="row border-3 form-group mb-3 align-items-center">
                <Input
                  type="text"
                  name="surname"
                  label="Full Name:"
                  value={user.surname}
                  placeholder="SURNAME"
                  onChange={handleInputs}
                  errorMessage={errors.surname}
                />
                <Input
                  type="text"
                  name="name"
                  placeholder="NAME"
                  value={user.name}
                  onChange={handleInputs}
                  errorMessage={errors.name}
                />
                <Input
                  type="text"
                  name="fathername"
                  placeholder="FATHERNAME"
                  value={user.fathername}
                  onChange={handleInputs}
                  errorMessage={errors.fatherName}
                />
              </div>
              {error.name && <p className="text-danger">{error.name}</p>}

              <div className="row border-3 form-group mb-3 align-items-center">
                <Input
                  type="text"
                  name="father_name"
                  label="Full father Name:"
                  placeholder="Enter Father Name"
                  value={user.father_name}
                  onChange={handleInputs}
                />
              </div>
              <div className="row border-3 form-group mb-3 align-items-center">
                <Input
                  type="text"
                  name="mother_name"
                  label="Full mother Name:"
                  placeholder="Enter Mother Name"
                  value={user.mother_name}
                  onChange={handleInputs}
                />
              </div>
              <div className="row border-3 form-group mb-3 align-items-center">
                <Input
                  type="textarea"
                  name="address"
                  label="Address:"
                  value={user.address}
                  onChange={handleInputs}
                  placeholder="Enter the Address"
                />
              </div>
              <div className="row border-3 form-group mb-3 align-items-center">
                <Input
                  type="text"
                  name="whatsapp_no"
                  label="Mobile No:"
                  placeholder="Whatsapp No."
                  value={user.whatsapp_no}
                  onChange={(e) => handlenumber(e, 10)}
                  errorMessage={errors.mobileNo}
                  required
                />

                <Input
                  type="text"
                  name="parent_contact_no"
                  placeholder="Parent No."
                  value={user.parent_contact_no}
                  onChange={(e) => handlenumber(e, 10)}
                />
              </div>
              {error.whatsapp_no && (
                <p className="text-danger">{error.whatsapp_no}</p>
              )}
              <div className="row border-3 form-group mb-3 align-items-center">
                <Input
                  type="email"
                  name="email"
                  label="Email:"
                  placeholder="Student Email Address"
                  value={user.email}
                  onChange={handleInputs}
                  errorMessage={errors.email}
                  required
                />
              </div>

              {error.email && <p className="text-danger">{error.email}</p>}

              <RadioGroup
                label={"Gender:"}
                name={"gender"}
                onChange={handleInputs}
                data={[
                  { label: "Male", value: "male" },
                  { label: "Female", value: "female" },
                ]}
                checked={user.gender}
              />
              <div className="row border-3 form-group mb-3 align-items-center">
                <Input
                  type="date"
                  name="birth_date"
                  value={user.birth_date}
                  label="Birth Date:"
                  onChange={handleInputs}
                />

                <Input
                  type="text"
                  name="birth_place"
                  value={user.birth_place}
                  label="Birth Place:"
                  placeholder="birthplace.."
                  onChange={handleInputs}
                />
              </div>

              <div className="row border-3 form-group mb-3 align-items-center">
                <Input
                  type="text"
                  name="city"
                  label="City:"
                  placeholder="city"
                  value={user.city}
                  onChange={handleInputs}
                />

                <Input
                  type="text"
                  name="district"
                  label="District:"
                  placeholder="district"
                  value={user.district}
                  onChange={handleInputs}
                />

                <Input
                  type="text"
                  name="pincode"
                  label="Pincode:"
                  placeholder="pincode"
                  value={user.pincode}
                  onChange={(e) => handlenumber(e, 6)}
                />
              </div>

              <div className="row border-3 form-group mb-3 align-items-center">
                <Input
                  type="text"
                  name="last_organization_studied_from"
                  label="Last Organization Studied From:"
                  placeholder="Institute/School Name.."
                  value={user.last_organization_studied_from}
                  onChange={handleInputs}
                />

                <Input
                  type="number"
                  name="last_studied_year"
                  label="Last Studied Year:"
                  value={user.last_studied_year}
                  onChange={handleInputs}
                  min="2000"
                  max={new Date().getFullYear()}
                />
              </div>
              <div className="row border-3 form-group mb-3 align-items-center">
                <Input
                  label="Student Image:"
                  type="file"
                  name="studentimg"
                  onChange={handleFileUploads}
                  accept={"image/png, image/jpg, image/jpeg"}
                  errorMessage={errors.studentImg}
                  required
                />
              </div>
              {error.studentimg && (
                <p className="text-danger">{error.studentimg}</p>
              )}

              {previewImage && (
                <div className="my-2">
                  {/* eslint-disable-next-line */}
                  <img src={previewImage} alt="image preview" height={200} />
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary btn-lg w-100"
                onClick={handleSubmit}
                disabled={submitting}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export { AdmissionForm };
