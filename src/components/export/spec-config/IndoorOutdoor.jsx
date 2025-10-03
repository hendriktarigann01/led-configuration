import React from "react";
import { View } from "@react-pdf/renderer";
import { BasePage } from "../BasePage";
import { PageHeader, PageFooter } from "../../shared/PDFSharedComponents";
import { SpecificationPage } from "../../shared/SpecificationTable";
import { buildConfigSpecifications } from "../../../utils/SpecConfigHelpers";

const styles = {
  content: {
    paddingHorizontal: 64,
    paddingVertical: 80,
    flex: 1,
  },
};

export const IndoorOutdoorConfig = ({ data }) => {
  if (!data?.calculations?.processedValues) return null;

  const specifications = buildConfigSpecifications(data, data.isVideoWall);
  if (!specifications) return null;

  return (
    <BasePage>
      <PageHeader />
      <View style={styles.content}>
        <SpecificationPage 
          specifications={specifications} 
          pageTitle="Specification"
        />
      </View>
      <PageFooter />
    </BasePage>
  );
};