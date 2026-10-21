"use client";
import styles from "./page.module.css";
import formStyles from '../components/forms/form.module.css'
import axios from '../../libraries/axios';
import { AxiosError } from 'axios';
import { useState, useContext, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';

import PopupContext from '@/app/context/popup/context';

import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Svg from "../components/ui/Svg/Svg";
import Select from "../components/ui/Select";
import speciesIcons from "@/libraries/species-icons";
import eventCategoryIcons from "@/libraries/event-category-icons";

import getErrorMessages from "@/utils/getErrorMessages";

import { useUserData } from '@/hooks/useUserData';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaw, faOtter, faXmark, faAngleDown, faBarsStaggered, faFeatherPointed, faCloudArrowUp, faEye } from '@fortawesome/free-solid-svg-icons';
import { useSpecies } from "@/hooks/useSpecies";

export default function Profile() {
  // Context.
  const { setPopup } = useContext(PopupContext);
  const router = useRouter();

  // Hooks.
  const { user, pets, setPets, userLoading, userError } = useUserData({eventLimit: 3});
  const { species, speciesLoading, speciesError } = useSpecies();

  // States.
  const [expandedRowId, setExpandedRowId] = useState<number>(0);
  const [loadingSave, setLoadingSave] = useState(false);
  const loading = userLoading || speciesLoading;
  const hasError = userError != null || speciesError != null;
  const expandedPet = expandedRowId !== null && expandedRowId !== undefined ? pets[expandedRowId]: null;

  // Refs.
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Error handling.
  const errors = [userError, speciesError];

  useEffect(() => {
    if (loading || errors.length === 0) return;

    setPopup({ messages: getErrorMessages(errors), type: 'error'});

    const anyErrors = errors.some((e) => e != null)
    if (anyErrors) router.replace("/account/2");
  }, [loading, userError, speciesError]);

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

      const response = await axios.post('/upsert/pet', data);

      setPopup({messages: [response?.data?.message], type: 'success'});
    } catch (e) {
        setPopup({ messages: getErrorMessages([e]), type: 'error'});
    } finally {
      setLoadingSave(false);
    }
  }

  const removePet = async (id:Number) => {
    try {
      const response = await axios.post('/remove/pet', {id: id});
      setPopup({messages: [response?.data?.message], type: 'success', isVisible: true});
    } catch (e) {
        setPopup({messages: getErrorMessages([e]), type: 'error'});
    } finally {
      window.sessionStorage.removeItem("expandedRowId");
      window.location.reload();
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const index = Number(e.target.getAttribute('data-index'));
    const { name, value } = e.target;

    updatePets(index, name, value);
  };

  const handleSpeciesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const index = Number(e.target.getAttribute('data-index'));
    const { name, value } = e.target;

    const iconKey = e.target.selectedOptions[0].dataset.icon;

    updatePets(index, name, value, iconKey);
  };

  const updatePets = (index: number, name: string, value: string, iconKey: string | void) => {
    setPets(prev => {
      const updatedPets = [...prev];
      updatedPets[index] = { ...updatedPets[index], [name] : value }

      if (iconKey) {
        updatedPets[index] = {
          ...updatedPets[index],
          species: { ...updatedPets[index].species, icon: iconKey },
        }
      }

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

  const handleAddEvent = (e:React.MouseEvent<HTMLButtonElement>, petId:number) => {
    e.preventDefault();
    if (user && user.id && petId) {
      router.push(`/profile/add/event/${user?.id}/${petId}`);
    } else {
      setPopup({messages: ['Something went wrong'], type: 'error'})
    }
    
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
    if (index === expandedRowId) return;

    index === expandedRowId ? setExpandedRowId(0) : setExpandedRowId(index); // setExpandedRowId(null) ?

    window.sessionStorage.setItem("expandedRowId", String(index));

    window.scrollTo({top: 100, behavior: "smooth"});
  }

  const handleAvatarClick = async () => {
    if (expandedPet?.id) {
      inputRef.current?.click();
    }
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const petId = expandedPet?.id;

    if (files && files.length > 0 && petId) {
      const selectedFile = files[0];

      const data = {id: petId, image: selectedFile};

      try {
        const response = await axios.post('/update/pet/image', data, {
          headers: {'Content-Type': 'multipart/form-data'}}
        );

        updatePets(expandedRowId, 'imagePath', response.data.imageUrl);
      }
      catch (e) {
        setPopup({messages: getErrorMessages([e]), type: 'error'});
      }
    }
  }

  // Return an empty page, just displaying the header and footer.
  if (loading || hasError || !user) return <main className={`${styles.mainInit} ${styles.loading}`}><FontAwesomeIcon icon={faOtter} spinPulse size="3x"/></main>;

  if (pets.length === 0) {
    return (
      <main className={styles.mainInit}>
      <h1>Welcome {user?.name ? " " + user.name : ""}</h1>
      <h2>Add a pet to get started</h2>
      <div className={styles.buttonAreaInit}>
        <div className={styles.buttonGroupInit}>
          <Button type="submit" onClick={handleAdd}>
            Add New Pet
            <FontAwesomeIcon icon={faOtter}/>
          </Button>
        </div>
      </div>
      </main>
    )
  }

  return (
    <main className={styles.main}>

      {/* Input for avatar changes */}
      <input className={styles.hidden} type="file" ref={inputRef} onChange={handleAvatarChange}></input>

      <section id="cards" className={styles.cards}>
        {expandedPet && expandedRowId !== null && (
          <div id={String(expandedPet.id)} className={styles.expandedRow} key={expandedPet.id}>
            <div className={styles.petCol}>
              <div className={styles.card}>
                <Svg type="primary" index={expandedRowId} />
                <Svg type="secondary" index={expandedRowId} />

                <div className={styles.viewTimeline}>
                  <Button
                    icon={true}
                    style={{ color: "#171717" }}
                    onClick={(e) =>
                      routeToTimeline(e, expandedPet.name, expandedPet.id)
                    }
                    tooltip={`View Timeline`}
                  >
                    <FontAwesomeIcon icon={faBarsStaggered} />
                  </Button>
                </div>

                {expandedPet.imagePath && (
                  <div
                    className={styles.avatarContainer}
                    id={`avatar${expandedPet.id}`}
                    onClick={handleAvatarClick}
                  >
                    
                    <img
                      className={styles.avatar}
                      src={expandedPet.imagePath}
                      alt={expandedPet.name}
                    />
                  </div>
                )}

                <form className={styles.form}>
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

                  <label className={formStyles.formLabel} htmlFor="speciesId">
                    Species
                    <FontAwesomeIcon icon={speciesIcons[expandedPet.species?.icon ?? 'dragon']}/>
                  </label>
                  <Select
                    id="speciesId"
                    name="speciesId"
                    onChange={handleSpeciesChange}
                    options={species}
                    data-index={expandedRowId}
                    defaultValue={expandedPet.speciesId}
                  />

                  <label className={formStyles.formLabel} htmlFor="breed">
                    Breed
                  </label>
                  <Input
                    id="breed"
                    type="text"
                    name="breed"
                    value={expandedPet.breed ? expandedPet.breed : ''}
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
                    value={expandedPet.birthday ? expandedPet.birthday : ''} // Handle null
                    onChange={handleChange}
                    data-index={expandedRowId}
                  />
                </form>
              </div>
            </div>

            <div className={styles.eventCol}>
              <div className={styles.eventHead}>
                <h2>Recent Events</h2>

                  <div className={styles.removePet}>
                    <Button
                      icon={true}
                      tooltip="Remove Pet"
                      onClick={(e) => handleRemovePet(e, expandedPet.id)}
                    >
                      <FontAwesomeIcon icon={faXmark} />
                    </Button>
                  </div>
              </div>

              {expandedPet.events.length === 0 && (

                <div className={styles.event}>
                  <div className={styles.timelineSection}>
                    <div className={styles.eventIcon}>
                      <FontAwesomeIcon icon={faPaw}/>
                    </div>
                    <div className={styles.timelineLower} />
                  </div>

                  <div className={styles.eventContentContainer}>
                    <div className={styles.eventContent}>
                      <h3>You don't have any events yet</h3>
                      <p>Click on the button below to get started.</p>
                    </div>
                  </div>
                </div>

              )}

              {expandedPet.events.map((event, index) => {
                return (
                  <div className={styles.event} key={index}>
                  <div className={styles.timelineSection}>
                    {index !== 0 && (
                      <div className={styles.timelineUpper} />
                      )}
                    <div className={styles.eventIcon}>
                      <FontAwesomeIcon icon={eventCategoryIcons[event.category?.icon ?? 'paw']}/>
                    </div>
                    {index !== expandedPet.events.length - 1 && (
                      <div className={styles.timelineLower} />
                    )}
                    {expandedPet.events.length === 1 && (
                      <div className={styles.timelineLower} />
                    )}
                  </div>

                  <div className={styles.eventContentContainer}>
                    <div className={styles.eventContent}>
                      <h3>{event.title}</h3>
                      <p>
                        {
                          event.description
                          &&
                          event.description.length > 200
                          ?
                          `${event.description.slice(0, 200)}...`
                          :
                          event.description
                        }
                      </p>
                    </div>
                    <div className={styles.eventDate}>
                      <p>{event.date}</p>
                      <p>{event.date ? `(${new Date(event.date).toDateString()})` : ""}</p>
                    </div>
                  </div>
                  </div>
                );
              })}

              {expandedPet.events.length === 0 && (
                <div className={styles.eventBtn}>
                  <Button type="submit" onClick={(e) => handleAddEvent(e, expandedPet.id)}>
                    Add Event
                    <FontAwesomeIcon icon={faFeatherPointed}/>
                  </Button>
                </div>
              )}
              {expandedPet.events.length > 0 && (
                <div className={styles.eventBtn}>
                  <Button type="submit" onClick={(e) => handleManageEvents(e, expandedPet.id)}>
                    Manage Events
                    <FontAwesomeIcon icon={faFeatherPointed}/>
                  </Button>
                </div>
              )}

              <h2>{user?.name}'s pets</h2>
              {pets.map((pet, index) =>
                  <div
                    className={styles.collapsedRow}
                    onClick={(e) => toggleExpand(index)}
                    key={pet.id}
                  >
                    {pet.name}

                    {index === expandedRowId &&
                    
                    <div className={styles.toggleExpandBtn}>
                      <Button
                        icon={true}
                        onClick={(e) => toggleExpand(index)}
                        style={{ color: "#000" }}
                        tooltip="Active"
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </Button>
                    </div>

                    }

                    {index !== expandedRowId &&

                    <div className={styles.toggleExpandBtn}>
                      <Button
                        icon={true}
                        onClick={(e) => toggleExpand(index)}
                        tooltip="Expand"
                        style={{ color: "#000" }}
                      >
                        <FontAwesomeIcon icon={faAngleDown} />
                      </Button>
                    </div>

                    }
                  </div>
              )}
            </div>
          </div>
        )}
      </section>

      <div className={styles.buttonArea}>
        <div className={styles.buttonGroup}>
            <Button
              type="submit"
              onClick={handleSave}
              loading={loadingSave}
            >
              Save Changes
              <FontAwesomeIcon icon={faCloudArrowUp}/>
            </Button>

          <Button type="submit" onClick={handleAdd}>
            Add New Pet
            <FontAwesomeIcon icon={faOtter}/>
          </Button>
        </div>
      </div>
    </main>
  );
}