import React from 'react';

import Photo from "../src/components/Photo";

export default {
  component: Photo,
  title: 'Photo',
}

const Template = args => <Photo {...args} />;


export const Default = Template.bind({});
Default.args = {
  index: '0',
  onClickHandler: () => {},
  photo: {
    key: '0',
    src: 'https://picsum.photos/id/0/200/300',
    width: 200,
    height: 300,
    alt: '',
    title: '',
    srcSet: [],
    sizes: [],
  },
  margin: 0,
  direction: 'row',
  top: 0,
  left: 0,
}