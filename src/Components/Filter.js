import React from 'react';
import {
  Container,
  Dropdown,
  Grid,
  Input,
  Label,
} from 'semantic-ui-react';


const optionPriceBuy = [
  { key: 0, text: 'Any Price', value: 0 },
  { key: 1, text: '$100,000+', value: 1 },
  { key: 2, text: '$200,000+', value: 2 },
  { key: 3, text: '$300,000+', value: 3 },
  { key: 4, text: '$500,000+', value: 4 },
  { key: 5, text: '$1,000,000+', value: 5 },
]

const optionPriceRent = [
  { key: 0, text: 'Any Price', value: 0 },
  { key: 1, text: '$500/month+', value: 1 },
  { key: 2, text: '$750/month+', value: 2 },
  { key: 3, text: '$1000/month+', value: 3 },
  { key: 4, text: '$1500/month+', value: 4 },
  { key: 5, text: '$2000/month+', value: 5 },
]

const optionBeds = [
  { key: 0, text: 'Any Beds', value: 0 },
  { key: 1, text: '1+ Beds', value: 1 },
  { key: 2, text: '2+ Beds', value: 2 },
  { key: 3, text: '3+ Beds', value: 3 },
  { key: 4, text: '4+ Beds', value: 4 },
  { key: 5, text: '5+ Beds', value: 5 },
]

const optionBaths = [
  { key: 0, text: 'Any Baths', value: 0 },
  { key: 1, text: '1+ Baths', value: 1 },
  { key: 2, text: '2+ Baths', value: 2 },
  { key: 3, text: '3+ Baths', value: 3 },
  { key: 4, text: '4+ Baths', value: 4 },
  { key: 5, text: '5+ Baths', value: 5 },
]

const optionType = [
  { key: 0, text: 'Any Type', value: 0 },
  { key: 1, text: 'Houses', value: 1 },
  { key: 2, text: 'Apartments', value: 2 },
  { key: 3, text: 'Condos', value: 3 },
  { key: 4, text: 'Townhouses', value: 4 },
  { key: 5, text: 'Land/Lots', value: 5 },
]


export default class Filter extends React.Component {
  constructor(props) {
    super(props);
    console.log("Filter - props: ");
    console.log(props);
    this.bsr = 'buy';     // default

    // Do this first, to see if we got passed a search string.
    // If we did, set the zoom to 9.
    if (props.location && props.location.state && props.location.state.bsr)
    {
      this.bsr = props.location.state.bsr;
      console.log("Filter - bsr term = ", props.location.state.bsr);
    }

    this.state = {
      priceValue: 'Price',
      bedValue: 'Beds',
      bathValue: 'Baths',
      typeValue: 'Type',
    }
  }

  // event.target is a <span> node, and I need the child text node
  // in order to get the actual text value. If the user clicks the
  // 'x' button (to clear the selection), 'event.target.childNodes[0]'
  // will be undefined, so just reset the price to 'Price'.
  onChangePrice = (event, data) => {
    let spanText = "Price";
    if (this.bsr === 'buy') {
      if (data.value !== '') // ie, user hit X button to clear filter
        spanText = optionPriceBuy[data.value]['text'];
    }
    else {
      if (data.value !== '') // ie, user hit X button to clear filter
        spanText = optionPriceRent[data.value]['text'];
    }
    // if (event.target) {
    //   let [key, value] = Object.entries(event.target)[0];
    //   spanText = value.child ? value.child.stateNode.innerHTML :
    //     value.stateNode.innerHTML;
    //   console.log("onChangePrice - spanText = ", spanText)
    // }
    this.setState({ 'priceValue': spanText });
    this.props.onFilterChange({ 'price': spanText })
  }

  onChangeBed = (event, data) => {
    let spanText = "Beds";
    if (data.value !== '') // ie, user hit X button to clear filter
      spanText = optionBeds[data.value]['text'];
    // if (event.target) {
    //   let [key, value] = Object.entries(event.target)[0];
    //   spanText = value.child ? value.child.stateNode.innerHTML :
    //     value.stateNode.innerHTML;
    //   console.log("onChangeBed - spanText = ", spanText)
    // }
    this.setState({ 'bedValue': spanText });
    this.props.onFilterChange({ 'beds': spanText })
  }

  onChangeBath = (event, data) => {
    let spanText = "Baths";
    //console.log(data);
    if (data.value !== '') // ie, user hit X button to clear filter
      spanText = optionBaths[data.value]['text'];
    // if (event.target) {
    //   let [key, value] = Object.entries(event.target)[0];
    //   spanText = value.child ? value.child.stateNode.innerHTML :
    //     value.stateNode.innerHTML;
    //   console.log("onChangeBath - spanText = ", spanText)
    // }
    this.setState({ 'bathValue': spanText });
    this.props.onFilterChange({ 'baths': spanText })
  }

  onChangeType = (event, data) => {
    let spanText = "Type";
    if (data.value !== '') // ie, user hit X button to clear filter
      spanText = optionType[data.value]['text'];
    // console.log(spanText);
    // if (event.target) {
    //   let [key, value] = Object.entries(event.target)[0];
    //   spanText = value.child ? value.child.stateNode.innerHTML :
    //     value.stateNode.innerHTML;
    //   console.log("onChangeType - spanText = ", spanText)
    // }
    this.setState({ 'typeValue': spanText });
    this.props.onFilterChange({ 'type': spanText })
  }

  // TODO - DEFINE callbacks for year built min/max and sqft min/max edit boxes

  render() {
    return (
      <Container>
        <Grid columns={3}>
          <Grid.Row style={{ paddingTop: '0px', marginTop: '24px',
            paddingBottom: '0px', marginBottom: '0px' }}>
            <Grid.Column>
              { this.bsr === 'buy' &&
              <Dropdown icon='dollar sign' text={this.state.priceValue}
                options={optionPriceBuy} selection clearable button labeled
                className='icon' onChange={this.onChangePrice}
                style={{ zIndex: '1101'}}/>
              }
              { this.bsr === 'rent' &&
              <Dropdown icon='dollar sign' text={this.state.priceValue}
                options={optionPriceRent} selection clearable button labeled
                className='icon' onChange={this.onChangePrice}
                style={{ zIndex: '1101'}}/>
              }
            </Grid.Column>
            <Grid.Column>
              <Dropdown icon='bed' text={this.state.bedValue}
                options={optionBeds} selection clearable button labeled
                className='icon' onChange={this.onChangeBed}
                style={{ zIndex: '501'}}/>
            </Grid.Column>
            <Grid.Column>
              <Dropdown icon='bath' text={this.state.bathValue}
                options={optionBaths} selection clearable button labeled
                className='icon' onChange={this.onChangeBath}
                style={{ zIndex: '501'}}/>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row style={{ paddingTop: '0px', marginTop: '20px',
            paddingBottom: '0px', marginBottom: '30px' }}>
            <Grid.Column>
              <Dropdown icon='home' text={this.state.typeValue}
                options={optionType} selection clearable  button labeled
                className='icon' onChange={this.onChangeType}
                style={{ zIndex: '1100'}}/>
            </Grid.Column>
            <Grid.Column style={{ paddingTop: '8px', paddingRight: '0px' }}>
              <Label size='small' basic horizontal color='blue'
                style={{ marginBottom: '5px', borderStyle: 'none',
                paddingLeft: '0px', paddingRight: '0px'}}>
                Year Built:</Label>
              <Input placeholder='Min' style={{ width: '55px', height: '25px' }}>
                <input style={{paddingLeft: '6px', paddingRight: '6px'}}/>
              </Input>
              <p style={{ display: 'inline'}}> - </p>
              <Input placeholder='Max' style={{ width: '58px', height: '25px' }}>
                <input style={{paddingLeft: '6px', paddingRight: '6px'}}/>
              </Input>
            </Grid.Column>
            <Grid.Column style={{ paddingTop: '8px', paddingRight: '0px' }}>
              <Label size='small' basic horizontal color='blue'
                style={{ marginBottom: '5px', borderStyle: 'none',
                paddingLeft: '0px', paddingRight: '0px'}}>
                Sq. Feet:</Label>
                <Input placeholder='Min' style={{ width: '55px', height: '25px' }}>
                  <input style={{paddingLeft: '3px', paddingRight: '3px'}}/>
                </Input>
                <p style={{ display: 'inline'}}> - </p>
                <Input placeholder='Max' style={{ width: '58px', height: '25px' }}>
                  <input style={{paddingLeft: '3px', paddingRight: '3px'}}/>
                </Input>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}
