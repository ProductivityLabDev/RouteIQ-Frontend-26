import React, { useState } from "react";
import Loader from "./Loader";

const withLoader = (WrappedComponent) => {
  return (props) => {
    const [loading, setLoading] = useState(false);

    const handleClick = (e) => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 200);
    };

    return (
      <>
        {loading && <Loader />}
        <div onClick={handleClick}>
          <WrappedComponent {...props} />
        </div>
      </>
    );
  };
};

export default withLoader;
