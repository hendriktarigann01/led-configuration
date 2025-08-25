export const SpecificationPage = () => {
  const specifications = [
    { category: 'Display Requirements', items: [
      { label: 'Screen Configuration', value: '4 x 4' },
      { label: 'Number Of Cabinet', value: '16 Pcs' },
      { label: 'Display Resolution', value: '1.376 x 1.032' },
    ]},
    { category: 'Display Wall', items: [
      { label: 'Dimensions', value: '2.56 (0.64) x 1.92 (0.48)' },
      { label: 'Display Area', value: '0.84 m2' },
      { label: 'Weight Cabinet', value: '124.8 kg' },
    ]},
    { category: 'Power Requirements', items: [
      { label: 'Max Power', value: '10.400 W' },
      { label: 'Average Power', value: '4.800 W' },
    ]},
  ];

  return (
    <BasePage>
      <div className="px-16 py-20">
        <div className="text-center mb-16">
          <h2 className="text-2xl font-light text-gray-700 flex items-center justify-center space-x-4">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
              <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
            </div>
            <span>Specification</span>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
              <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
            </div>
          </h2>
        </div>

        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="w-full">
            <tbody>
              {specifications.map((section, sectionIndex) => (
                <React.Fragment key={sectionIndex}>
                  {section.items.map((item, itemIndex) => (
                    <tr key={`${sectionIndex}-${itemIndex}`} className="border-b border-gray-200">
                      <td className="py-4 px-6 bg-gray-50 font-medium text-gray-700 border-r border-gray-200">
                        {itemIndex === 0 ? section.category : ''}
                      </td>
                      <td className="py-4 px-6 text-gray-600 border-r border-gray-200">{item.label}</td>
                      <td className="py-4 px-6 text-gray-800 font-medium">{item.value}</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </BasePage>
  );
};