import React from 'react';
import { Button, Checkbox, Form, Header } from 'semantic-ui-react';
import { Redirect } from 'react-router';


export default class SellForm extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {
      redirect: false
    };
  }

  handleSubmit = (e) => {
    this.setState({redirect: true});
  }

  render () {
    if (this.state.redirect)
    {
      console.log("SellForm, render, redirecting to home");
      return <Redirect push to={{pathname: "/"}} />;
    }
    return (
      <Form style={{ margin: '20px'}}>
        <Header as='h2'>Please enter your contact information and an agent will be in touch. Thanks!</Header>
        <Form.Field>
          <label>First Name</label>
          <input placeholder='First Name' />
        </Form.Field>
        <Form.Field>
          <label>Last Name</label>
          <input placeholder='Last Name' />
        </Form.Field>
        <Form.Field>
          <label>Address</label>
          <input placeholder='Address' />
        </Form.Field>
        <Form.Field>
          <label>Phone</label>
          <input placeholder='Phone' />
        </Form.Field>
        <Button type='submit' style={{marginTop: '20px'}}
          onClick={this.handleSubmit} >
          Submit
        </Button>
        <Header as='h5' style={{color:'#bbb'}}>[Since this is a fake site, nothing will actually be submitted.]</Header>
      </Form>
    );
  }
}
