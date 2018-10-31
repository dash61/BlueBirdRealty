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

export default class SignUpPage extends React.Component {
  state = { open: false };

  show = () => this.setState({ open: true });
  close = () => this.setState({ open: false });

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
              <Image src="/images/logo4.png" className="rounded" /> Sign into
              your account
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
                  Sign In
                </Button>
              </Segment>
            </Form>
            <Message>
              Have an account? <a href="/login">&nbsp;&nbsp;Log In</a>
            </Message>
          </Grid.Column>
        </Grid>

        <Modal
          size={"mini"}
          open={open}
          onClose={this.close}
          style={{ height: "auto" }}
        >
          <Modal.Header>Welcome</Modal.Header>
          <Modal.Content>
            <p>You are now signed up!</p>
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
