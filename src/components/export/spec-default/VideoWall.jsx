import React from "react";
import { View } from "@react-pdf/renderer";
import { BasePage } from "../BasePage";
import { PageHeader, PageFooter } from "../../shared/PDFSharedComponents";
import { SpecificationPage } from "../../shared/SpecificationTable";
import { getVideoWallSpecifications } from "../../../constants/SpecificationData";

const styles = {
  content: {
    paddingHorizontal: 64,
    paddingVertical: 80,
    flex: 1,
  },
};

export const VideoWall = ({ data }) => (
  <BasePage>
    <PageHeader />
    <View style={styles.content}>
      <SpecificationPage specifications={getVideoWallSpecifications(data)} />
    </View>
    <PageFooter />
  </BasePage>
);