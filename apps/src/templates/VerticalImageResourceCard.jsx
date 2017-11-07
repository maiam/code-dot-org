import React, { PropTypes, Component } from 'react';
import Radium from 'radium';
import color from "../util/color";
import Button from './Button';

const styles = {
  card: {
    overflow: 'hidden',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: color.border_gray,
    position: 'relative',
    height: 440,
    width: 308,
    marginBottom: 20,
    backgroundColor: color.white
  },
  jumboCard: {
    overflow: 'hidden',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: color.border_gray,
    position: 'relative',
    height: 440,
    width: 463,
    marginBottom: 20,
    backgroundColor: color.white
  },
  image: {
    width: 310,
    height: 220,
    backgroundColor: color.purple
  },
  jumboImage: {
    width: 463,
    height: 220,
    backgroundColor: color.purple
  },
  text: {
    fontFamily: '"Gotham 4r", sans-serif',
    color: color.charcoal,
  },
  title: {
    padding: 20,
    fontSize: 20,
  },
  button: {
    margin: 20,
  },
  description: {
    paddingLeft: 20,
    paddingRight: 20,
    fontSize: 14,
    lineHeight: 1.5,
  },
  shareLink: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: color.border_gray,
    fontSize: 16,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    padding: 5,
    width: 258,
  },
  ltr: {
    float: 'left',
  },
  rtl: {
    float: 'right',
    textAlign: 'right'
  },
};

/**
 * A card used on /congrats to display information about a particular course or
 * HoC follow-up activity. Not to be confused with CourseCard, the larger
 * component used on /home for scripts and courses specific to a user.
 * ImageResourceCard is also similar, but has image and text aligned
 * horizontally. The jumbo version fits 2 across in a row.
 */

class VerticalImageResourceCard extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    buttonText: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    isRtl: PropTypes.bool.isRequired,
    MCShareLink: PropTypes.string,
    jumbo: PropTypes.bool
  };

  render() {
    const { title, description, link, buttonText, isRtl, jumbo, MCShareLink } = this.props;
    const cardStyle = jumbo ? styles.jumboCard : styles.card;
    const imageStyle = jumbo ? styles.jumboImage : styles.image;
    const localeStyle = isRtl ? styles.rtl : styles.ltr;

    return (
      <div style={[cardStyle, localeStyle]}>
        <div style={imageStyle}/>
        <div>
          <div style={[styles.text, styles.title, localeStyle]}>
            {title}
          </div>
          <div style={[styles.text, styles.description, localeStyle]}>
           {description}
          </div>
          {MCShareLink && (
            <div style={[styles.text, styles.shareLink, localeStyle]}>
             {MCShareLink}
            </div>
          )}
          <Button
            href={link}
            color={Button.ButtonColor.gray}
            text={buttonText}
            style={[styles.button, localeStyle]}
          />
        </div>
      </div>
    );
  }
}

export default Radium(VerticalImageResourceCard);
