import EmailGroupForm from "./EmailGroupForm";
import React, { useState } from "react";
import RegistrationFormTypical from "./RegistrationFormTypical";
import RegistrationFormFullControlled from "./RegistrationFormFullControlled";
import RegistrationFormFullUncontrolled from "./RegistrationFormFullUncontrolled";
import RegistrationFormExtended from "./RegistrationFormExtended";
import DomainFieldTypical from "./DomainFieldTypical";
import DomainFieldExtended from "./DomainFieldExtended";
import DomainFieldFullControlled from "./DomainFieldFullControlled";
import DomainFieldFullUncontrolled from "./DomainFieldFullUncontrolled";

const App = () => {
  const [registrationFormType, setRegistrationFormType] = useState("full_controlled");
  const handleChangeRegistrationFormType = (e) => setRegistrationFormType(e.target.value);
  const [domainFieldType, setDomainFieldType] = useState("full_controlled");
  const handleChangeDomainFieldType = (e) => setDomainFieldType(e.target.value);

  return (
    <>
      Legend:
      <br />
      <br />
      <div>
        <span className="ff-field-valid">valid field</span>
        <span className="ff-field-invalid">invalid field</span>
        <span className="ff-field-validating">validating field</span>
        <span className="ff-form-valid">valid form</span>
        <span className="ff-form-invalid">invalid form</span>
        <span className="ff-form-validating">validating form</span>
        <span className="ff-form-positive-submit">positive submit result form</span>
        <span className="ff-form-negative-submit">negative submit result form</span>
        <span className="ff-form-submitting">submitting form</span>
      </div>
      <hr />
      <h2>Registration form</h2>
      Form type:
      <div>
        <label htmlFor="registration-form-type-full-controlled">
          <input
            id="registration-form-type-full-controlled"
            type="radio"
            name="registration_form_type"
            value="full_controlled"
            checked={registrationFormType === "full_controlled"}
            onChange={handleChangeRegistrationFormType}
          />
          Full controlled
        </label>
        <label htmlFor="registration-form-type-full-uncontrolled">
          <input
            id="registration-form-type-full-uncontrolled"
            type="radio"
            name="registration_form_type"
            value="full_uncontrolled"
            checked={registrationFormType === "full_uncontrolled"}
            onChange={handleChangeRegistrationFormType}
          />
          Full uncontrolled
        </label>
        <label htmlFor="registration-form-type-typical">
          <input
            id="registration-form-type-typical"
            type="radio"
            name="registration_form_type"
            value="typical"
            checked={registrationFormType === "typical"}
            onChange={handleChangeRegistrationFormType}
          />
          Typical
        </label>
        <label htmlFor="registration-form-type-full-extended">
          <input
            id="registration-form-type-full-extended"
            type="radio"
            name="registration_form_type"
            value="extended"
            checked={registrationFormType === "extended"}
            onChange={handleChangeRegistrationFormType}
          />
          Extended
        </label>
      </div>
      <br />
      {registrationFormType === "full_controlled" && <RegistrationFormFullControlled />}
      {registrationFormType === "full_uncontrolled" && <RegistrationFormFullUncontrolled />}
      {registrationFormType === "typical" && <RegistrationFormTypical />}
      {registrationFormType === "extended" && <RegistrationFormExtended />}
      <hr />
      <h2>Email group form</h2>
      <EmailGroupForm />
      <hr />
      <h2>Domain field</h2>
      Field type:
      <div>
        <label htmlFor="domain-field-type-full_controlled">
          <input
            id="domain-field-type-full_controlled"
            type="radio"
            name="domain_field_type"
            value="full_controlled"
            checked={domainFieldType === "full_controlled"}
            onChange={handleChangeDomainFieldType}
          />
          Full controlled
        </label>
        <label htmlFor="domain-field-type-full-uncontrolled">
          <input
            id="domain-field-type-full-uncontrolled"
            type="radio"
            name="domain_field_type"
            value="full_uncontrolled"
            checked={domainFieldType === "full_uncontrolled"}
            onChange={handleChangeDomainFieldType}
          />
          Full uncontrolled
        </label>
        <label htmlFor="domain-field-type-typical">
          <input
            id="domain-field-type-typical"
            type="radio"
            name="domain_field_type"
            value="typical"
            checked={domainFieldType === "typical"}
            onChange={handleChangeDomainFieldType}
          />
          Typical
        </label>
        <label htmlFor="domain-field-type-full-extended">
          <input
            id="domain-field-type-full-extended"
            type="radio"
            name="domain_field_type"
            value="extended"
            checked={domainFieldType === "extended"}
            onChange={handleChangeDomainFieldType}
          />
          Extended
        </label>
      </div>
      <br />
      {domainFieldType === "full_controlled" && <DomainFieldFullControlled />}
      {domainFieldType === "full_uncontrolled" && <DomainFieldFullUncontrolled />}
      {domainFieldType === "typical" && <DomainFieldTypical />}
      {domainFieldType === "extended" && <DomainFieldExtended />}
      <br />
      <br />
      <br />
    </>
  );
};

export default App;
