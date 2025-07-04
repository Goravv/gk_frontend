import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import API from "../api";
import { setNextCaseNumber, resetNextCaseNumberToOne } from "../app/Slices/packingSlice";

function CaseNumberFetcher({ client_name, marka }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCaseNo = async () => {
      try {
        const response = await API.get(
          `/api/packing/packing-details/?client=${client_name}&marka=${marka}`
        );

        const data = response.data;

        if (Array.isArray(data) && data.length === 0) {
          dispatch(resetNextCaseNumberToOne());
        } else {
          const lastItem = data[data.length - 1];
          dispatch(setNextCaseNumber(Number(lastItem.case_no_end) + 1));
        }
        
      } catch (error) {
        console.error("Failed to fetch case number:", error);
        dispatch(resetNextCaseNumberToOne());
      }
    };

    if (client_name && marka) {
      fetchCaseNo();
    }
  }, [client_name, marka, dispatch]);

  return null; 
}

export default CaseNumberFetcher;
