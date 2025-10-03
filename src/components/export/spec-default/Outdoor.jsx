import React from "react";
import { View } from "@react-pdf/renderer";
import { BasePage } from "../BasePage";
import { PageHeader, PageFooter } from "../../shared/PDFSharedComponents";
import { SpecificationPage } from "../../shared/SpecificationTable";
import { getOutdoorSpecifications } from "../../../constants/SpecificationData";

const styles = {
  content: {
    paddingHorizontal: 64,
    paddingVertical: 80,
    flex: 1,
  },
};

export const Outdoor = ({ data }) => (
  <BasePage>
    <PageHeader />
    <View style={styles.content}>
      <SpecificationPage specifications={getOutdoorSpecifications(data)} />
    </View>
    <PageFooter />
  </BasePage>
);