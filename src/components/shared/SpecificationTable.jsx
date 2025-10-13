// components/shared/SpecificationTable.jsx
import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { SharedStyles } from "../../styles/SharedStyles";

export const SpecificationTable = ({ specifications }) => (
  <View style={SharedStyles.tableContainer}>
    <View style={SharedStyles.table}>
      {specifications.map((section, sectionIndex) => (
        <View
          key={sectionIndex}
          style={[
            SharedStyles.sectionContainer,
            sectionIndex === specifications.length - 1 && SharedStyles.lastSection,
          ]}
        >
          <View style={SharedStyles.sectionRow}>
            <View style={SharedStyles.mergedCategoryCell}>
              <Text style={SharedStyles.categoryText}>{section.category}</Text>
            </View>

            <View style={SharedStyles.itemsContainer}>
              {section.items.map((item, itemIndex) => (
                <View
                  key={itemIndex}
                  style={[
                    SharedStyles.itemRow,
                    itemIndex === section.items.length - 1 && SharedStyles.lastItemRow,
                  ]}
                >
                  <View style={SharedStyles.labelCell}>
                    <Text style={SharedStyles.labelText}>{item.label}</Text>
                  </View>
                  <View style={SharedStyles.valueCell}>
                    <Text style={SharedStyles.valueText}>{item.value}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      ))}
    </View>
  </View>
);

export const SpecificationPage = ({ specifications, pageTitle = "Product Specification" }) => (
  <>
    <View style={SharedStyles.titleContainer}>
      <View style={SharedStyles.titleWrapper}>
        <DotsGroup />
        <Text style={SharedStyles.sectionTitle}>{pageTitle}</Text>
        <DotsGroup reverse />
      </View>
    </View>
    <SpecificationTable specifications={specifications} />
  </>
);

const DotsGroup = ({ reverse = false }) => {
  const dots = [
    SharedStyles.dotPrimary,
    SharedStyles.dotSecondary,
    SharedStyles.dotTertiary,
  ];
  const dotStyles = reverse ? [...dots].reverse() : dots;

  return (
    <View style={SharedStyles.dotsContainer}>
      {dotStyles.map((dotStyle, i) => (
        <View key={i} style={[SharedStyles.dot, dotStyle]} />
      ))}
    </View>
  );
};