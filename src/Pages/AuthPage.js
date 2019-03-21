import React from "react";
import {
  Button,
  Form,
  Grid,
  Header,
  Image,
  Message,
  Modal,
  Segment
} from "semantic-ui-react";
import { NavLink } from 'react-router-dom';

// Strings that differentiate btw login and signup versions of this page.
const choices = [
  {
    title: "Log-in to your account",
    button1: "Log-In",
    button2a: "New to us?",
    button2b: " Sign Up",
    path: '/auth/signup',
    final: 'You are logged into your account!',
  },
  {
    title: "Sign into your account",
    button1: "Sign Up",
    button2a: "Have an account?",
    button2b: " Log In",
    path: '/auth/login',
    final: 'You are now signed up!',
  }
];

export default class AuthPage extends React.Component {
  constructor(props)
  {
    super(props);
    console.log("Auth page ctor - props=", props);
    this.state = { open: false, update: 0 };
    if (this.props.match.params.type === 'signup')
      this.state.update = 1;
  }

  show = () => this.setState({ open: true });
  close = () => this.setState({ open: false });

  // We need this to capture the update when the user switches between
  // login and signup (or visa-versa) while on one of these pages.
  // This seems to be the only signal that the route switch has occurred.
  // So we manually update our choice variable to the opposite state.
  componentWillReceiveProps = (nextProps) => {
    //console.log("Auth - cwrp, nextProps=", nextProps.match.params.type);
    if (nextProps.match.params.type === 'login' && this.state.update === 1) {
      this.setState({ update: 0 });
    }
    else if (nextProps.match.params.type === 'signup' && this.state.update === 0) {
      this.setState({ update: 1 });
    }
  }

  render() {
    const { open } = this.state;

    return (
      <div className="login-form" style={{ padding: "2em 0em" }}>
        {/*
          Heads up! The styles below are necessary for the correct render of this example.
          You can do same with CSS, the main idea is that all the elements up to the `Grid`
          below must have a height of 100%.
        */}
        <style>{`
          body > div,
          body > div > div,
          body > div > div > div.login-form {
            height: 100%;
          }
        `}</style>
        <Grid
          textAlign="center"
          style={{ height: "100%" }}
          verticalAlign="middle"
        >
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as="h2" color="teal" textAlign="center">
              <Image src="/images/logo4.png" className="rounded" />
                {choices[this.state.update].title}
            </Header>
            <Form size="large">
              <Segment stacked>
                <Form.Input
                  fluid
                  icon="user"
                  iconPosition="left"
                  placeholder="E-mail address"
                />
                <Form.Input
                  fluid
                  icon="lock"
                  iconPosition="left"
                  placeholder="Password"
                  type="password"
                />

                <Button color="teal" fluid size="large"
                  onClick={this.show}
                >
                  {choices[this.state.update].button1}
                </Button>
              </Segment>
            </Form>
            <Message>
              {choices[this.state.update].button2a}
              <Message.Item basic size='medium'
                as={NavLink} to={choices[this.state.update].path}>&nbsp;&nbsp;
                  {choices[this.state.update].button2b}
              </Message.Item>
            </Message>
          </Grid.Column>
        </Grid>

        <Modal size={"mini"} open={open} onClose={this.close}
          style={{height:'auto'}}>
          <Modal.Header>Welcome</Modal.Header>
          <Modal.Content>
            <p>{choices[this.state.update].final}</p>
          </Modal.Content>
          <Modal.Actions>
            <Button
              positive
              icon="checkmark"
              labelPosition="right"
              content="Ok"
              onClick={this.close}
            />
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}
