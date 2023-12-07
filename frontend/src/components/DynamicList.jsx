// Libraries
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// Components
import DynamicButton from './DynamicButton';
import DynamicCheckBox from './DynamicCheckBox';

// Contexts
import { AuthContext } from '../contexts/AuthContext';
import { useModal, InfoModal } from '../contexts/ModalContext';

// Utilities
import httpRequest from '../utils/apiServices';

// Styling
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

const DynamicList = ({
  fetchDataFunction,
  dataKey,
  role,
  list,
  addItem,
  removeItem,
  showButtons,
  showCheckboxes,
  showFilter,
}) => {
  const navigate = useNavigate();
  const { userId, logout } = useContext(AuthContext);
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
    await httpRequest('POST', '/logout');
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
      .filter(item => item.id !== userId)
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

export default DynamicList;
