import React, { useEffect, useState } from "react";
import handleAPINotToken from "../../apis/handleAPINotToken";
import { Welcome } from "../../component";
import { Link } from "react-router-dom";
import BuildingComponent from "../../component/building/BuildingComponent";

const BuildClientScreen = () => {
  return (
    <>
      <BuildingComponent />
    </>
  );
};

export default BuildClientScreen;
