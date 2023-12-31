// Libraries
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types'; // Import PropTypes

// Components
import DynamicButton from './DynamicButton';
import DynamicCheckBox from './DynamicCheckBox';

// Contexts
import { AuthContext } from '../contexts/AuthContext';
import { useModal, InfoModal } from '../contexts/ModalContext';

// Utilities
import InputGroup from 'react-bootstrap/InputGroup';

import axiosJWT from '../utils/axiosJWT';
// Styling
import Form from 'react-bootstrap/Form';

const DynamicList = ({
  fetchDataFunction,
  dataKey,
  list,
  addItem,
  removeItem,
  showButtons,
  showCheckboxes,
  showFilter,
}) => {
  const navigate = useNavigate();
  const { currentUser, logout } = useContext(AuthContext);
  const { showModal, closeModal } = useModal();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchDataFunction();
        if (response.error) {
          setErrorMsg(`${response.error} ${response.errorMsg}`);
          // Handle errors
          showModal(
            <InfoModal
              show={true}
              handleClose={closeModal}
              title={response.error}
              body={response.message}
              primaryAction={
                response.status === 403 ? handleLogout : closeModal
              }
            />
          );
        } else {
          setData(response.data[dataKey + '_list']);
        }
      } catch (error) {
        setErrorMsg(error.message || 'An error occurred');
        // Handle error
      }
      setLoading(false);
    };

    fetchData();
  }, [fetchDataFunction, dataKey]);

  // Logout if token expired
  const handleLogout = async () => {
    await axiosJWT.post('/logout');
    closeModal();
    logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    const text = e.target.value.toLowerCase();
    setSearchText(text);
  };

  const filterData = (item) => {
    const nameIncludesText = item.name.toLowerCase().includes(searchText);
    return nameIncludesText;
  };

  const filteredData =
    data && showFilter === true ? data.filter(filterData) : data;

  const buttons = filteredData.map((item) => (
    // <DynamicButton key={item._id} data={item} component={buttonComponent} />
    <DynamicButton key={item._id} data={item} dataKey={dataKey} />
  ));

  // Do not show the current user in the list
  const checkboxes = list
  ? filteredData
      .filter(item => item.id !== currentUser.id)
      .map(item => (
        <DynamicCheckBox
          key={item._id}
          data={item}
          list={list}
          addItem={addItem}
          removeItem={removeItem}
        />
      ))
  : null;

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : errorMsg ? (
        <p className="text-danger">{errorMsg}</p>
      ) : (
        data && (
          <div>
            {showFilter && (
              <div>
                {/* Search athlete based on name */}
                <InputGroup className="mb-3">
                  <InputGroup.Text>🔍</InputGroup.Text>
                  <Form.Control
                    autoFocus
                    placeholder="Name"
                    value={searchText}
                    onChange={handleSearch}
                  />
                </InputGroup>
              </div>
            )}

            {/* Filtered athlete / user list */}
            {showButtons && (
              <div className="grid grid-cols-2 gap-[7px] md:grid-cols-3 lg:grid-cols-4 mb-4">
                {buttons}
              </div>
            )}
            {/* Filtered athlete / user list */}
            {showCheckboxes && (
              <div className="grid grid-cols-2 gap-[7px] md:grid-cols-3 lg:grid-cols-4 mb-4">
                {checkboxes}
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
};

// Prop Types validation
DynamicList.propTypes = {
  fetchDataFunction: PropTypes.func.isRequired,
  dataKey: PropTypes.string.isRequired,
  list: PropTypes.array,
  addItem: PropTypes.func,
  removeItem: PropTypes.func,
  showButtons: PropTypes.bool,
  showCheckboxes: PropTypes.bool,
  showFilter: PropTypes.bool,
};

export default DynamicList;
