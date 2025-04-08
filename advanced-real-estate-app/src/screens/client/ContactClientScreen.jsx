import React from "react";
import { appInfo } from "../../constants/appInfos";
import { BsBuildingsFill } from "react-icons/bs";
import { MdSettingsPhone } from "react-icons/md";

const ContactClientScreen = () => {
  return (
    <div
      style={{
        paddingTop: "150px",
      }}
    >
      <div className="container-xxl py-5">
        <div className="container">
          <div
            className="text-center wow fadeInUp"
            data-wow-delay="0.1s"
            style={{
              visibility: "visible",
              animationDelay: "0.1s",
              animationName: "fadeInUp",
            }}
          >
            <h6 className="section-title text-center text-primary text-uppercase">
              {appInfo.title}
            </h6>
            <h1 className="mb-5">
              <span className="text-primary text-uppercase">LIÊN HỆ </span> VỚI
              CHÚNG TÔI
            </h1>
          </div>
          <div className="row g-4">
            <div className="col-12">
              <div className="row gy-4">
                <div className="col-md-4">
                  <h6 className="section-title text-start text-primary text-uppercase">
                    EMAIL
                  </h6>
                  <p>
                    <i className="fa fa-envelope-open text-primary me-2" />
                    {appInfo.email}
                  </p>
                </div>
                <div className="col-md-4">
                  <h6 className="section-title text-start text-primary text-uppercase">
                    ĐỊA CHỈ CÔNG TY
                  </h6>
                  <p>
                    <BsBuildingsFill className="fa fa-envelope-open text-primary me-2" />
                    {appInfo.address}
                  </p>
                </div>
                <div className="col-md-4">
                  <h6 className="section-title text-start text-primary text-uppercase">
                    ĐIỆN THOẠI
                  </h6>
                  <p>
                    <MdSettingsPhone className="fa fa-envelope-open text-primary me-2" />
                    tech@example.com
                  </p>
                </div>
              </div>
            </div>
            <div
              className="col-md-6 wow fadeIn"
              data-wow-delay="0.1s"
              style={{
                visibility: "visible",
                animationDelay: "0.1s",
                animationName: "fadeIn",
              }}
            >
              {/* eslint-disable-next-line jsx-a11y/iframe-has-title */}
              {/*https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3001156.4288297426!2d-78.01371936852176!3d42.72876761954724!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4ccc4bf0f123a5a9%3A0xddcfc6c1de189567!2sNew%20York%2C%20USA!5e0!3m2!1sen!2sbd!4v1603794290143!5m2!1sen!2sbd*/}
              <iframe
                className="position-relative rounded w-100 h-100"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3833.7772444314774!2d108.22045321536284!3d16.075121088875494!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314219ceaea9a141%3A0x1d2a4f713e1c9d08!2zQ8awIHPhu58gMyBRdWFuZyBUcnVuZyAtIMSQaeG7h24gaOG7jWMgRHV5IFTDom4!5e0!3m2!1svi!2s!4v1712569731494!5m2!1svi!2s"
                frameBorder={0}
                style={{ minHeight: 350, border: 0 }}
                allowFullScreen=""
                aria-hidden="false"
                tabIndex={0}
              />
            </div>
            <div className="col-md-6">
              <div
                className="wow fadeInUp"
                data-wow-delay="0.2s"
                style={{
                  visibility: "visible",
                  animationDelay: "0.2s",
                  animationName: "fadeInUp",
                }}
              >
                <form>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          type="text"
                          className="form-control"
                          id="name"
                          placeholder="Your Name"
                        />
                        <label htmlFor="name">Your Name</label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          placeholder="Your Email"
                        />
                        <label htmlFor="email">Your Email</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-floating">
                        <input
                          type="text"
                          className="form-control"
                          id="subject"
                          placeholder="Subject"
                        />
                        <label htmlFor="subject">Subject</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-floating">
                        <textarea
                          className="form-control"
                          placeholder="Leave a message here"
                          id="message"
                          style={{ height: 150 }}
                          defaultValue={""}
                        />
                        <label htmlFor="message">Message</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <button
                        className="btn btn-primary w-100 py-3"
                        type="submit"
                      >
                        Send Message
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactClientScreen;
