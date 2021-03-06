import React from 'react';
import { Image, Segment } from 'semantic-ui-react';


const LogoAvatar = () => (
  <Segment.Group horizontal style={{ margin: '0', width: 'auto',
    backgroundColor: 'rgba(0,0,86,0.95)', border: 'none',
    alignItems: 'center' }}>
    <Segment style={{ maxWidth: '120px', width: '50%'}}>
      <div>
        <Image src='/images/logo2a.png'
          className='rounded'
          verticalAlign='middle'
          style={{ marginBottom: '0em' }}
        />
      </div>
    </Segment>
    <Segment.Group vertical="true" size='tiny'
      style={{ marginBottom: '0', marginLeft: '0', borderStyle: 'none',
        fontFamily:"Lato,'Helvetica Neue',Arial,Helvetica,sans-serif",
        width: '50%' }}>
      <Segment inverted style={{ padding: '6px',
        color: 'rgba(255,255,255,1.0)', backgroundColor: 'rgba(0,0,86,1.0)' }}>
        <span
          style={{ fontSize: '1.5rem', fontWeight: '700' }}
        > Bluebird</span>
      </Segment>
      <Segment inverted style={{ borderStyle: 'none', padding: '6px',
        color: 'rgba(255,255,255,1.0)', backgroundColor: 'rgba(0,0,86,1.0)'}}>
        <span
          style={{ fontSize: '1.5rem', fontWeight: '700' }}
        > Realty</span>
      </Segment>
    </Segment.Group>
  </Segment.Group>
)

export default LogoAvatar;
