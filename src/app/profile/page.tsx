"use client";
import styles from "./page.module.css";
import formStyles from '../components/forms/form.module.css'
import axios from '../../libraries/axios';
import { AxiosError } from 'axios';
import { useState, useContext, useMemo, useEffect } from "react";
import { useRouter } from 'next/navigation';

import PopupContext from '@/app/context/popup/context';

import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Svg from "../components/ui/Svg/Svg";

import { useUserData } from '@/hooks/useUserData';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faOtter, faXmark, faPlus, faArrowRight, faAngleDown, faAngleUp, faTimeline, faBarsStaggered, faFeatherPointed, faCloudArrowUp } from '@fortawesome/free-solid-svg-icons';

export default function Profile() {
  const { setPopup } = useContext(PopupContext);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [loadingSave, setLoadingSave] = useState(false);
  const { user, pets, setPets } = useUserData(router, setLoading, setPopup, {eventLimit: 4});
  const [expandedRowId, setExpandedRowId] = useState<number | null>(0);

  // Window is not available during server-side rendering in Next.js. useEffect runs after the component mounts.
  useEffect(() => {
    const storedExpandedRowId = window.sessionStorage.getItem("expandedRowId");
    if (storedExpandedRowId) {
      setExpandedRowId(Number(storedExpandedRowId));
    }
  }, []);

  const savePets = async () => {
    try {
      setLoadingSave(true);
      const data = {pets: pets};
      const response = await axios.post('/api/upsert/pet', data);
      setPopup({messages: [response?.data?.message], type: 'success', isVisible: true});
    } catch (error) {
      if (error instanceof AxiosError) { // Handle Axios errors.
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
        console.error('Error message:', error.message);
        let errorMessage: any = 'Something went wrong.';

        // Deal with the response from the server.
        if (typeof(error.response?.data?.error) === "string") {
          errorMessage = [error.response?.data?.error];
        } else if (typeof(error.response?.data?.error)  === "object") {
          errorMessage = Object.values(error.response?.data?.error);
        }

        setPopup({messages: [errorMessage], type: 'error', isVisible: true});
      } else {
        // Handle non-Axios errors.
        console.error('Unexpected error:', error);
        setPopup({messages: ['Something went wrong.'], type: 'error', isVisible: true});
      }
    } finally {
      setLoadingSave(false);
    }
  }

  const removePet = async (id:Number) => {
    try {
      const response = await axios.post('/api/remove/pet', {id: id});
      console.log(pets);
      setPopup({messages: [response?.data?.message], type: 'success', isVisible: true});
    } catch (error) {
      if (error instanceof AxiosError) { // Handle Axios errors.
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
        console.error('Error message:', error.message);
        let errorMessage: any = 'Something went wrong.';

        // Deal with the response from the server.
        if (typeof(error.response?.data?.error) === "string") {
          errorMessage = [error.response?.data?.error];
        } else if (typeof(error.response?.data?.error)  === "object") {
          errorMessage = Object.values(error.response?.data?.error);
        }
        setPopup({messages: [errorMessage], type: 'error', isVisible: true});
      } else {
        // Handle non-Axios errors.
        console.error('Unexpected error:', error);
        setPopup({messages: ['Something went wrong.'], type: 'error', isVisible: true});
      }
    } finally {
      window.sessionStorage.removeItem("expandedRowId");
      window.location.reload();
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const index = Number(e.target.getAttribute('data-index'));
    const { name, value } = e.target;

    setPets(prev => {
      const updatedPets = [...prev];
      updatedPets[index] = { ...updatedPets[index], [name] : value } // Use brackets around e.g. "name" when inserting a variable dynamically.
      return updatedPets;
    })
  };

  const handleSave = () => {
    savePets();
  }

  const handleAdd = () => {
    router.push('/profile/add/pet');
  }

  const handleRemovePet = (e:React.MouseEvent<HTMLButtonElement>, id:number) => {
    e.preventDefault();
    const div = document.getElementById(String(id))
    div?.remove()
    removePet(id);
  }

  const handleAddEvent = (e:React.MouseEvent<HTMLButtonElement>, id:number) => {
    e.preventDefault();
    router.push(`/profile/add/event/${id}`);
  }

  const handleManageEvents = (e:React.MouseEvent<HTMLButtonElement>, id:number) => {
    e.preventDefault();
    router.push(`/profile/manage/events/${id}`);
  }

  const routeToTimeline = (e:React.MouseEvent<HTMLButtonElement>, name:string, id:number) => {
    e.preventDefault();

    name = name.toLowerCase();
    router.push(`/timeline/${name}/${id}`);
  }

  const toggleExpand = (index: number) => {
    index === expandedRowId ? setExpandedRowId(null) : setExpandedRowId(index);

    window.sessionStorage.setItem("expandedRowId", String(index));

    window.scrollTo({
      top: 100,
      left: 100,
      behavior: "smooth"
    });
  }

  // Return an empty page, just displaying the header and footer.
  if (loading) return <main className={`${styles.main} ${styles.loading}`}><FontAwesomeIcon icon={faOtter} spinPulse size="3x"/></main>;


const expandedPet = expandedRowId !== null && expandedRowId !== undefined ? pets[expandedRowId]: null;

return (
  <main className={styles.main}>

    <section id="cards" className={styles.cards}>
      {expandedPet && expandedRowId !== null && (
        <div className={styles.expandedRow} key={expandedPet.id} id={String(expandedPet.id)}>
          <div className={styles.petCol}>

            {/* <div className={styles.toggleCollapseBtn}>
              <Button
                icon={true}
                onClick={(e) => toggleExpand(expandedRowId)}
                tooltip="Show/hide"
                style={{ color: "#171717" }}
              >
                <FontAwesomeIcon icon={faAngleUp} />
              </Button>
            </div> */}

            <div className={styles.card}>
              <Svg type="primary" index={expandedRowId} />
              <Svg type="secondary" index={expandedRowId} />

              {expandedPet.imagePath && (
                <div
                  className={styles.avatarContainer}
                  id={`avatar${expandedPet.id}`}
                >
                  
                  <img
                    className={styles.avatar}
                    src={expandedPet.imagePath}
                    alt={expandedPet.name}
                  />
                </div>
              )}

              <form className={styles.form}>
                <div className={styles.iconGroup}>
                  <Button
                    icon={true}
                    animation="spinPulse"
                    tooltip="Add Event"
                    onClick={(e) => handleAddEvent(e, expandedPet.id)}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </Button>

                  <Button
                    icon={true}
                    animation="spinPulseReverse"
                    tooltip="Remove Pet"
                    onClick={(e) => handleRemovePet(e, expandedPet.id)}
                  >
                    <FontAwesomeIcon icon={faXmark} />
                  </Button>
                </div>

                <label className={formStyles.formLabel} htmlFor="name">
                  Name
                </label>
                <Input
                  id="name"
                  type="text"
                  name="name"
                  value={expandedPet.name}
                  onChange={handleChange}
                  data-index={expandedRowId}
                />

                <label className={formStyles.formLabel} htmlFor="species">
                  Species
                </label>
                <Input
                  id="species"
                  type="text"
                  name="species"
                  value={expandedPet.species}
                  onChange={handleChange}
                  data-index={expandedRowId}
                />

                <label className={formStyles.formLabel} htmlFor="breed">
                  Breed
                </label>
                <Input
                  id="breed"
                  type="text"
                  name="breed"
                  value={expandedPet.breed}
                  onChange={handleChange}
                  data-index={expandedRowId}
                />

                <label className={formStyles.formLabel} htmlFor="birthday">
                  Birthday
                </label>
                <Input
                  id="birthday"
                  type="date"
                  name="birthday"
                  value={expandedPet.birthday}
                  onChange={handleChange}
                  data-index={expandedRowId}
                />

                <div className={styles.timelineIcon}>
                  <Button
                    icon={true}
                    onClick={(e) =>
                      routeToTimeline(e, expandedPet.name, expandedPet.id)
                    }
                    tooltip={`View ${expandedPet.name}'s Timeline`}
                  >
                    <FontAwesomeIcon icon={faBarsStaggered} />
                  </Button>
                </div>
              </form>
            </div>
          </div>

          <div className={styles.eventCol}>
            <h2>Recent Events</h2>

            {expandedPet.events.map((event, index) => (
              <div className={styles.event} key={index}>
                <div className={styles.timelineSection}>
                  {index !== 0 && <div className={styles.timelineUpper} />}
                  <div className={styles.eventIcon}>
                    <i className="fa-solid fa-paw" />
                  </div>
                  {index !== expandedPet.events.length - 1 && (
                    <div className={styles.timelineLower} />
                  )}
                </div>

                <div className={styles.eventContentContainer}>
                  <div className={styles.eventContent}>
                    <h3>{event.title}</h3>
                    <p>{event.description}</p>
                  </div>
                  <div className={styles.eventDate}>
                    <p>{event.date}</p>
                    <p>{event.date ? `(${new Date(event.date).toDateString()})` : ""}</p>
                  </div>
                </div>
              </div>
            ))}

            <div className={styles.manageBtn}>
              <Button type="submit" onClick={(e) => handleManageEvents(e, expandedPet.id)}>
                Manage Events
                <FontAwesomeIcon icon={faFeatherPointed}/>
              </Button>
            </div>

            {pets.length > 1 && (
              <h2>{user?.name}'s pets</h2>
            )}
            {pets.map((pet, index) =>
              index !== expandedRowId ? (
                <div
                  className={styles.collapsedRow}
                  onClick={(e) => toggleExpand(index)}
                  key={pet.id}
                >
                  {pet.name}

                  <div className={styles.toggleExpandBtn}>
                    <Button
                      icon={true}
                      onClick={(e) => toggleExpand(index)}
                      tooltip="Show/hide"
                      style={{ color: "#000" }}
                    >
                      <FontAwesomeIcon icon={faAngleDown} />
                    </Button>
                  </div>
                </div>
              ) : null
            )}

          </div>
        </div>
      )}
    </section>

    <div className={styles.buttonArea}>
      <div className={styles.buttonGroup}>
        {pets.length > 0 && (
          <Button
            type="submit"
            onClick={handleSave}
            loading={loadingSave}
          >
            Save Changes
            <FontAwesomeIcon icon={faCloudArrowUp}/>
          </Button>
        )}

        <Button type="submit" onClick={handleAdd}>
          Add New Pet
          <FontAwesomeIcon icon={faOtter}/>
        </Button>
      </div>
    </div>
  </main>
);
}