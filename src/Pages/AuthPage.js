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
import { NavLink, useParams } from 'react-router-dom';

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

function AuthPage(props) {
  const [open, setOpen] = React.useState(false);
  const [update, setUpdate] = React.useState(0);
  const params = useParams();

  const show = () => setOpen(true);
  const close = () => setOpen(false);

  if (params?.type === 'login' && update === 1) {
    setUpdate(0);
  }
  else if (params?.type === 'signup' && update === 0) {
    setUpdate(1);
  }

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
            <Image src="/images/logo2a.png" size='large' rounded />
              {choices[update].title}
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
                onClick={show}
              >
                {choices[update].button1}
              </Button>
            </Segment>
          </Form>
          <Message>
            {choices[update].button2a}
            <Message.Item basic size='medium'
              as={NavLink} to={choices[update].path}>&nbsp;&nbsp;
                {choices[update].button2b}
            </Message.Item>
          </Message>
        </Grid.Column>
      </Grid>

      <Modal size={"mini"} open={open} onClose={close}
        style={{height:'auto'}}>
        <Modal.Header>Welcome</Modal.Header>
        <Modal.Content>
          <p>{choices[update].final}</p>
        </Modal.Content>
        <Modal.Actions>
          <Button
            positive
            icon="checkmark"
            labelPosition="right"
            content="Ok"
            onClick={close}
          />
        </Modal.Actions>
      </Modal>
    </div>
  );
}

export default AuthPage;
