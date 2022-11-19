import React from 'react';
import {
  Dropdown,
  Grid,
  Input,
  Label,
  Segment
} from 'semantic-ui-react';
import { YEARMIN, YEARMAX, SQFTMIN, SQFTMAX } from './Constants';


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
    this.bsr = props.bsr || 'buy';

    this.state = {
      priceValue: 'Price',
      bedValue: 'Beds',
      bathValue: 'Baths',
      typeValue: 'Type',
      yearMin: YEARMIN,
      yearMax: YEARMAX,
      sqftMin: SQFTMIN,
      sqftMax: SQFTMAX,
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
    // There are 2 ways to get the span text: the above, and this
    // commented out section. I've left it here as an example.
    // if (event.target) {
    //   let [key, value] = Object.entries(event.target)[0];
    //   spanText = value.child ? value.child.stateNode.innerHTML :
    //     value.stateNode.innerHTML;
    // }
    this.setState({ 'priceValue': spanText });
    this.props.onFilterChange({ 'price': spanText })
  }

  onChangeBed = (event, data) => {
    let spanText = "Beds";
    if (data.value !== '') // ie, user hit X button to clear filter
      spanText = optionBeds[data.value]['text'];
    this.setState({ 'bedValue': spanText });
    this.props.onFilterChange({ 'beds': spanText })
  }

  onChangeBath = (event, data) => {
    let spanText = "Baths";
    if (data.value !== '') // ie, user hit X button to clear filter
      spanText = optionBaths[data.value]['text'];
    this.setState({ 'bathValue': spanText });
    this.props.onFilterChange({ 'baths': spanText })
  }

  onChangeType = (event, data) => {
    let spanText = "Type";
    if (data.value !== '') // ie, user hit X button to clear filter
      spanText = optionType[data.value]['text'];
    this.setState({ 'typeValue': spanText });
    this.props.onFilterChange({ 'type': spanText })
  }

  onChangeYearMin = (event, data) => {
    this.props.onFilterChange({ 'yearMin': data.value });
  }

  onChangeYearMax = (event, data) => {
    this.props.onFilterChange({ 'yearMax': data.value });
  }

  onChangeSqftMin = (event, data) => {
    this.props.onFilterChange({ 'sqftMin': data.value });
  }

  onChangeSqftMax = (event, data) => {
    this.props.onFilterChange({ 'sqftMax': data.value });
  }

  render() {
    return (
      //<Container>
        <Grid container columns={3} stackable>
          <Grid.Row style={{ paddingTop: '0px', marginTop: '24px',
            paddingBottom: '0px', marginBottom: '0px' }}>
            <Grid.Column>
              <Segment basic style={{ paddingBottom: '0px'}}>
                { this.bsr === 'buy' &&
                <Dropdown icon='dollar sign' text={this.state.priceValue}
                  options={optionPriceBuy} selection clearable button labeled
                  className='icon' onChange={this.onChangePrice}
                  style={{ zIndex: '1103'}}/>
                }
                { this.bsr === 'rent' &&
                <Dropdown icon='dollar sign' text={this.state.priceValue}
                  options={optionPriceRent} selection clearable button labeled
                  className='icon' onChange={this.onChangePrice}
                  style={{ zIndex: '1103'}}/>
                }
              </Segment>
            </Grid.Column>
            <Grid.Column>
              <Segment basic style={{ paddingBottom: '0px'}}>
                <Dropdown icon='bed' text={this.state.bedValue}
                  options={optionBeds} selection clearable button labeled
                  className='icon' onChange={this.onChangeBed}
                  style={{ zIndex: '1102'}}/>
              </Segment>
            </Grid.Column>
            <Grid.Column>
              <Segment basic style={{ paddingBottom: '0px'}}>
                <Dropdown icon='bath' text={this.state.bathValue}
                  options={optionBaths} selection clearable button labeled
                  className='icon' onChange={this.onChangeBath}
                  style={{ zIndex: '1101'}}/>
              </Segment>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row style={{ paddingTop: '0px', marginTop: '0px',
            paddingBottom: '0px', marginBottom: '34px' }}>
            <Grid.Column>
              <Segment basic style={{ paddingBottom: '0px'}}>
                <Dropdown icon='home' text={this.state.typeValue}
                  options={optionType} selection clearable  button labeled
                  className='icon' onChange={this.onChangeType}
                  style={{ zIndex: '1100'}}/>
              </Segment>
            </Grid.Column>
            <Grid.Column style={{ paddingTop: '8px', paddingRight: '0px' }}>
              <Segment basic style={{ paddingBottom: '0px'}}>
                <Label size='small' basic horizontal color='blue'
                  style={{ marginBottom: '5px', borderStyle: 'none',
                  paddingLeft: '0px', paddingRight: '0px'}}>
                  Year Built:
                </Label>
                <Input placeholder='Min' style={{ width: '55px', height: '25px' }}
                  onChange={this.onChangeYearMin}>
                  <input style={{paddingLeft: '6px', paddingRight: '6px',
                    color: this.props.minYearColor }}/>
                </Input>
                <p style={{ display: 'inline'}}> - </p>
                <Input placeholder='Max' style={{ width: '58px', height: '25px' }}
                  onChange={this.onChangeYearMax}>
                  <input style={{paddingLeft: '6px', paddingRight: '6px',
                    color: this.props.maxYearColor }}/>
                </Input>
              </Segment>
            </Grid.Column>
            <Grid.Column style={{ paddingTop: '8px', paddingRight: '0px' }}>
              <Segment basic style={{ paddingBottom: '0px'}}>
                <Label size='small' basic horizontal color='blue'
                  style={{ marginBottom: '5px', borderStyle: 'none',
                  paddingLeft: '0px', paddingRight: '0px'}}>
                  Sq. Feet:
                </Label>
                <Input placeholder='Min' style={{ width: '55px', height: '25px' }}
                  onChange={this.onChangeSqftMin}>
                  <input style={{paddingLeft: '3px', paddingRight: '3px',
                    color: this.props.minSqftColor }}/>
                </Input>
                <p style={{ display: 'inline'}}> - </p>
                <Input placeholder='Max' style={{ width: '58px', height: '25px' }}
                  onChange={this.onChangeSqftMax}>
                  <input style={{paddingLeft: '3px', paddingRight: '3px',
                    color: this.props.maxSqftColor }}/>
                </Input>
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      //</Container>
    );
  }
}
