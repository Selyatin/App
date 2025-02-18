import _ from 'underscore';
import React, {useMemo, useEffect} from 'react';
import PropTypes from 'prop-types';
import CONST from '../../CONST';
import Modal from '../Modal';
import HeaderWithBackButton from '../HeaderWithBackButton';
import SelectionList from '../SelectionList';
import useLocalize from '../../hooks/useLocalize';
import ScreenWrapper from '../ScreenWrapper';
import styles from '../../styles/styles';
import searchCountryOptions from '../../libs/searchCountryOptions';
import StringUtils from '../../libs/StringUtils';

const propTypes = {
    /** Whether the modal is visible */
    isVisible: PropTypes.bool.isRequired,

    /** State value selected  */
    currentState: PropTypes.string,

    /** Function to call when the user selects a State */
    onStateSelected: PropTypes.func,

    /** Function to call when the user closes the State modal */
    onClose: PropTypes.func,

    /** The search value from the selection list */
    searchValue: PropTypes.string.isRequired,

    /** Function to call when the user types in the search input */
    setSearchValue: PropTypes.func.isRequired,

    /** Label to display on field */
    label: PropTypes.string,
};

const defaultProps = {
    currentState: '',
    onClose: () => {},
    onStateSelected: () => {},
    label: undefined,
};

function StateSelectorModal({currentState, isVisible, onClose, onStateSelected, searchValue, setSearchValue, label}) {
    const {translate} = useLocalize();

    useEffect(() => {
        if (isVisible) {
            return;
        }
        setSearchValue('');
    }, [isVisible, setSearchValue]);

    const countryStates = useMemo(
        () =>
            _.map(CONST.ALL_US_ISO_STATES, (state) => {
                const stateName = translate(`allStates.${state}.stateName`);
                const stateISO = translate(`allStates.${state}.stateISO`);
                return {
                    value: stateISO,
                    keyForList: stateISO,
                    text: stateName,
                    isSelected: currentState === stateISO,
                    searchValue: StringUtils.sanitizeString(`${stateISO}${stateName}`),
                };
            }),
        [translate, currentState],
    );

    const searchResults = searchCountryOptions(searchValue, countryStates);
    const headerMessage = searchValue.trim() && !searchResults.length ? translate('common.noResultsFound') : '';

    return (
        <Modal
            type={CONST.MODAL.MODAL_TYPE.RIGHT_DOCKED}
            isVisible={isVisible}
            onClose={onClose}
            onModalHide={onClose}
            hideModalContentWhileAnimating
            useNativeDriver
        >
            <ScreenWrapper
                style={[styles.pb0]}
                includePaddingTop={false}
                includeSafeAreaPaddingBottom={false}
            >
                <HeaderWithBackButton
                    title={label || translate('common.state')}
                    shouldShowBackButton
                    onBackButtonPress={onClose}
                />
                <SelectionList
                    headerMessage={headerMessage}
                    textInputLabel={label || translate('common.state')}
                    textInputValue={searchValue}
                    sections={[{data: searchResults, indexOffset: 0}]}
                    onSelectRow={onStateSelected}
                    onChangeText={setSearchValue}
                    initiallyFocusedOptionKey={currentState}
                />
            </ScreenWrapper>
        </Modal>
    );
}

StateSelectorModal.propTypes = propTypes;
StateSelectorModal.defaultProps = defaultProps;
StateSelectorModal.displayName = 'StateSelectorModal';

export default StateSelectorModal;
