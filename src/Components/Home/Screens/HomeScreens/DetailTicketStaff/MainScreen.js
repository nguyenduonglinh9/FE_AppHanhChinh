import {
  Dimensions,
  StyleSheet,
  View,
  Image,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  SafeAreaView,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import {
  Feather,
  AntDesign,
  Ionicons,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import moment from "moment";
import { SelectList } from "react-native-dropdown-select-list";
import ImageView from "react-native-image-viewing";
import { CommonActions } from "@react-navigation/native";
import Modal from "react-native-modal";
import LottieView from "lottie-react-native";

export default function DetailTicketStaff({ route, navigation }) {
  const { accessToken, idTicket, userID } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [inforTicket, setInforTicket] = useState();
  const [users, setUsers] = useState([]);
  const [selectedReason, setSelectedReason] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [note, setNote] = useState("");
  const [visibleImages, setIsVisibleImages] = useState(false);
  const [refesh, setRefesh] = useState([]);

  useEffect(() => {
    fetch(`https://ndl-be-apphanhchinh.onrender.com/ticket/${idTicket}`, {
      headers: {
        access_token: accessToken,
      },
    })
      .then((res) => res.json())
      .then((data) => setInforTicket(data));
  }, [refesh]);

  useEffect(() => {
    fetch("https://ndl-be-apphanhchinh.onrender.com/user", {
      headers: {
        access_token: accessToken,
      },
    })
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);
  const renderUser = (id) => {
    if (users != null) {
      return users
        .filter((item, index) => {
          return item.googleID == id;
        })
        .map((item, index) => {
          return (
            <View
              key={index}
              style={{
                // backgroundColor: "red",
                width: "100%",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Image
                style={{
                  width: 40,
                  aspectRatio: "1/1",
                  borderRadius: 40,
                }}
                source={{
                  uri: item.imageURL || null,
                }}
              ></Image>
              <Text style={{ fontSize: 16, fontWeight: 500, marginLeft: 10 }}>
                {item.name}
              </Text>
              <View
                style={{
                  width: 40,
                  aspectRatio: "1/1",
                  borderRadius: 40,
                  backgroundColor: "#e9ecef",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FontAwesome name="phone" size={24} color="#2245ac" />
              </View>
            </View>
          );
        });
    }
  };

  const reason = [
    { key: "Lỗi từ phía giảng viên", value: "Lỗi từ phía giảng viên" },
    { key: "Lỗi từ phía hệ thống", value: "Lỗi từ phía hệ thống" },
    { key: "Khác", value: "Khác" },
  ];
  const time = [
    { key: "15 Phút", value: "15 Phút" },
    { key: "30 Phút", value: "30 Phút" },
    { key: "1 Tiếng", value: "1 Tiếng" },
    { key: "2 Tiếng", value: "2 Tiếng" },
    { key: "1 Ngày", value: "1 Ngày" },
  ];
  // let trueResponse = JSON.parse("true");

  // let falseResponse = JSON.parse("false");

  const receiveTicket = () => {
    setModalVisible(true);

    const date1 = new Date(
      moment(inforTicket.createdAt).format("DD-MM-yyyy hh:mm")
    );
    const date2 = new Date(moment(new Date()).format("DD-MM-yyyy hh:mm"));

    let msDifference = date2 - date1;
    let minutes = Math.floor(msDifference / 1000 / 60);

    fetch(
      `https://ndl-be-apphanhchinh.onrender.com/ticket/update/${inforTicket._id}`,
      {
        method: "POST",
        headers: {
          access_token: accessToken,
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({
          status: "processing",
          receivedAt: new Date().toJSON(),
          staffID: userID,
          isTime: minutes < 15 ? true : false,
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.code == 200) {
          setModalVisible(false);
          setRefesh(["refesh"]);
        }
      });
  };

  const completeTicket = () => {
    fetch(
      `https://ndl-be-apphanhchinh.onrender.com/ticket/update/${inforTicket._id}`,
      {
        method: "POST",
        headers: {
          access_token: accessToken,
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({
          status: "finished",
          completedAt: new Date().toJSON(),
          note: note,
          reason: selectedReason,
          time: selectedTime,
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.code == 200) {
          setRefesh(["complete"]);
        }
      });
  };

  const handleShowImage = () => {
    const arr = [];

    for (let i = 0; i < inforTicket.images.length; i++) {
      arr.push({ uri: inforTicket.images[i] });
    }

    return (
      <ImageView
        images={arr}
        imageIndex={0}
        visible={visibleImages}
        onRequestClose={() => setIsVisibleImages(false)}
      />
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <AntDesign
            onPress={() => navigation.dispatch(CommonActions.goBack())}
            style={{ left: 10, top: 10, flex: 0.2 }}
            name="left"
            size={20}
            color="black"
          />
          <Text
            style={{ fontSize: 18, fontWeight: 700, width: "80%", flex: 0.8 }}
          >
            {inforTicket != null ? inforTicket.title : null}
          </Text>
        </View>

        <ScrollView>
          <View style={styles.body}>
            {/*xử lý hiển thị thông tin ticket*/}
            <View style={{ ...styles.inforTicket }}>
              <Text style={{ fontSize: 16, fontWeight: 700 }}>
                Người yêu cầu :{" "}
              </Text>
              <View
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-around",
                  marginTop: 10,
                  marginBottom: 10,
                }}
              >
                {inforTicket != null ? (
                  renderUser(inforTicket.userID)
                ) : (
                  <Text></Text>
                )}
              </View>

              <View
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 10,
                  marginTop: 10,
                  marginBottom: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    lineHeight: 21,
                    fontFamily: "Poppins_500Medium_Italic",
                    width: "35%",
                  }}
                >
                  Thời gian :
                </Text>
                {inforTicket != null ? (
                  <Text
                    style={{
                      fontWeight: 500,
                      fontSize: 20,
                      marginLeft: 10,
                      width: "65%",
                      lineHeight: 21,
                    }}
                  >
                    {moment(inforTicket.createdAt).format("hh:mm a")}
                  </Text>
                ) : null}
              </View>

              <View
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  marginTop: 10,
                  marginBottom: 10,
                  alignItems: "center",
                  padding: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    lineHeight: 21,
                    width: "35%",
                  }}
                >
                  Phòng :
                </Text>
                {inforTicket != null ? (
                  <Text
                    style={{
                      fontWeight: 500,
                      fontSize: 20,
                      marginLeft: 10,
                      flexShrink: 1,
                      lineHeight: 21,
                      width: "65%",
                    }}
                  >
                    {inforTicket.room}
                  </Text>
                ) : null}
              </View>
              <View
                style={{
                  marginTop: 10,
                  marginBottom: 10,
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "flex-start",
                  padding: 10,
                }}
              >
                <Text style={{ fontSize: 20, lineHeight: 21, width: "35%" }}>
                  Mô tả sự cố :
                </Text>
                {inforTicket != null ? (
                  <Text
                    style={{
                      fontWeight: 500,
                      fontSize: 20,
                      marginLeft: 10,
                      flexShrink: 1,
                      lineHeight: 21,
                      width: "65%",
                    }}
                  >
                    {inforTicket.description}
                  </Text>
                ) : null}
              </View>
            </View>
            {/*xử lý nút hiển thị hình ảnh*/}
            {inforTicket != null ? (
              inforTicket.status == "pending" ||
              inforTicket.status == "processing" ? (
                <Pressable
                  onPress={() => setIsVisibleImages(true)}
                  style={{
                    backgroundColor: "grey",
                    padding: 10,
                    borderRadius: 5,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <MaterialCommunityIcons
                    name="folder-multiple-image"
                    size={24}
                    color="white"
                  />
                  <Text style={{ marginLeft: 10, color: "white" }}>
                    Xem ảnh
                  </Text>
                </Pressable>
              ) : null
            ) : null}
            {/*xử lý giao diện ở các trạng thái ticket khác nhau*/}
            {inforTicket != null ? (
              inforTicket.status == "processing" ? (
                <>
                  <View
                    style={{
                      width: "90%",
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <View style={{ width: "58%" }}>
                      <SelectList
                        setSelected={(val) => setSelectedReason(val)}
                        data={reason}
                        maxHeight={150}
                        defaultOption={{ key: "0", value: "Nguyên nhân lỗi" }}
                        boxStyles={{
                          marginTop: 20,
                          maxWidth: "100%",
                          minWidth: "100%",
                          backgroundColor: "#f1f4f5",
                          // padding: 10,
                          borderRadius: 5,
                          shadowColor: "#000",
                          shadowOffset: {
                            width: 0,
                            height: 2,
                          },
                          shadowOpacity: 0.25,
                          shadowRadius: 3.84,

                          elevation: 5,
                          borderWidth: 0,
                        }}
                      />
                    </View>
                    <View style={{ width: "38%" }}>
                      <SelectList
                        setSelected={(val) => setSelectedTime(val)}
                        data={time}
                        maxHeight={150}
                        defaultOption={{ key: "0", value: "Thời gian" }}
                        boxStyles={{
                          marginTop: 20,
                          maxWidth: "100%",
                          minWidth: "100%",
                          backgroundColor: "#f1f4f5",
                          // padding: 10,
                          borderRadius: 5,
                          shadowColor: "#000",
                          shadowOffset: {
                            width: 0,
                            height: 2,
                          },
                          shadowOpacity: 0.25,
                          shadowRadius: 3.84,

                          elevation: 5,
                          borderWidth: 0,
                        }}
                      />
                    </View>
                  </View>
                  <View
                    style={{
                      width: "90%",
                      display: "flex",
                    }}
                  >
                    <TextInput
                      textAlignVertical="top"
                      style={styles.input3}
                      multiline={true}
                      numberOfLines={7}
                      placeholder="Ghi chú"
                      value={note}
                      onChangeText={(text) => setNote(text)}
                    ></TextInput>
                  </View>
                </>
              ) : inforTicket.status == "finished" ? (
                <View
                  style={{
                    width: "90%",
                    padding: 10,
                    backgroundColor: "#f1f4f5",
                    borderRadius: 5,
                  }}
                >
                  <Text style={{ fontSize: 16, fontWeight: 700 }}>
                    Trạng thái đã yêu cầu
                  </Text>
                  <View style={styles.groupStatus}>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        marginBottom: 20,
                      }}
                    >
                      <View
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: 50,
                          backgroundColor: "#2d5381",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginRight: 20,
                        }}
                      >
                        <AntDesign name="check" size={24} color="white" />
                      </View>
                      <View
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <Text>Đã yêu cầu</Text>
                        <Text>
                          {inforTicket != null
                            ? moment(inforTicket.createdAt).format("h:mm a")
                            : ""}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",

                        marginTop: 20,
                        marginBottom: 20,
                      }}
                    >
                      <View
                        style={
                          inforTicket != null
                            ? inforTicket.status == "pending"
                              ? {
                                  width: 50,
                                  height: 50,
                                  borderRadius: 50,
                                  backgroundColor: "white",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  marginRight: 20,
                                  borderColor: "#2d5381",
                                  borderWidth: 2,
                                }
                              : {
                                  width: 50,
                                  height: 50,
                                  borderRadius: 50,
                                  backgroundColor: "#2d5381",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  marginRight: 20,
                                }
                            : null
                        }
                      >
                        {inforTicket != null ? (
                          inforTicket.status == "pending" ? (
                            <Ionicons
                              name="ios-reload-outline"
                              size={24}
                              color="black"
                            />
                          ) : (
                            <AntDesign name="check" size={24} color="white" />
                          )
                        ) : null}
                      </View>
                      <View
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          // alignItems: "center",
                        }}
                      >
                        <Text>Yêu cầu đã tiếp nhận</Text>
                        <Text>
                          {inforTicket != null
                            ? inforTicket.status == "pending"
                              ? "--:--"
                              : moment(inforTicket.receivedAt).format("hh:mm a")
                            : ""}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        marginTop: 20,
                      }}
                    >
                      <View
                        style={
                          inforTicket != null
                            ? inforTicket.status == "pending" ||
                              inforTicket.status == "processing"
                              ? {
                                  width: 50,
                                  height: 50,
                                  borderRadius: 50,
                                  backgroundColor: "white",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  marginRight: 20,
                                  borderColor: "#2d5381",
                                  borderWidth: 2,
                                }
                              : {
                                  width: 50,
                                  height: 50,
                                  borderRadius: 50,
                                  backgroundColor: "#2d5381",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  marginRight: 20,
                                }
                            : null
                        }
                      >
                        {inforTicket != null ? (
                          inforTicket.status == "pending" ||
                          inforTicket.status == "processing" ? (
                            <Ionicons
                              name="ios-reload-outline"
                              size={24}
                              color="black"
                            />
                          ) : (
                            <AntDesign name="check" size={24} color="white" />
                          )
                        ) : (
                          ""
                        )}
                      </View>
                      <View
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <Text>Yêu cầu đã hoàn thành</Text>
                        <Text>
                          {inforTicket != null
                            ? inforTicket.status == "pending" ||
                              inforTicket.status == "processing"
                              ? "--:--"
                              : moment(inforTicket.completedAt).format(
                                  "hh:mm a"
                                )
                            : ""}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              ) : null
            ) : null}
            {/*Xử lý hiển thị phần đánh giá*/}
            {inforTicket != null ? (
              inforTicket.status == "finished" ? (
                <View
                  style={{
                    width: "90%",
                    backgroundColor: "#f1f4f5",
                    padding: 20,
                    borderRadius: 5,
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,

                    elevation: 5,
                    marginTop: 10,
                  }}
                >
                  {inforTicket != null ? (
                    inforTicket.status == "pending" ||
                    inforTicket.status == "processing" ? null : (
                      <View>
                        <Text style={{ fontSize: 16, fontWeight: 700 }}>
                          Nhận xét :
                        </Text>
                        {inforTicket.note != "" ? (
                          <Text>{inforTicket.note}</Text>
                        ) : (
                          <Text>Chưa có nhận xét cho phiếu này</Text>
                        )}
                      </View>
                    )
                  ) : null}
                </View>
              ) : null
            ) : null}

            {/*xử lý nút hiển thị ở các trạng thái ticket khác nhau*/}
            {inforTicket != null ? (
              inforTicket.status == "pending" ? (
                <Pressable
                  onPress={receiveTicket}
                  style={{ ...styles.button, width: "90%" }}
                >
                  <Text
                    style={{ color: "white", fontSize: 12, fontWeight: 700 }}
                  >
                    Tiếp Nhận
                  </Text>
                </Pressable>
              ) : inforTicket.status == "processing" ? (
                <View
                  style={{
                    display: "flex",
                    width: "90%",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Pressable
                    onPress={completeTicket}
                    style={{ ...styles.button, backgroundColor: "#29d13a" }}
                  >
                    <Text
                      style={{ color: "white", fontSize: 12, fontWeight: 700 }}
                    >
                      Hoàn thành
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={receiveTicket}
                    style={{ ...styles.button, backgroundColor: "#ff2d2d" }}
                  >
                    <Text
                      style={{ color: "white", fontSize: 12, fontWeight: 700 }}
                    >
                      Chưa xử lý được
                    </Text>
                  </Pressable>
                </View>
              ) : (
                <Pressable
                  onPress={receiveTicket}
                  style={{ ...styles.button, width: "90%" }}
                >
                  <Text
                    style={{ color: "white", fontSize: 12, fontWeight: 700 }}
                  >
                    Trở về
                  </Text>
                </Pressable>
              )
            ) : null}

            {inforTicket != null ? handleShowImage() : null}
          </View>
        </ScrollView>
      </View>
      <Modal isVisible={modalVisible}>
        <View
          style={{
            backgroundColor: "white",
            padding: 20,
            height: 100,
            display: "flex",
            alignItems: "center",
            borderRadius: 10,
          }}
        >
          <LottieView
            source={require("../../../../../../assets/lotties/loading.json")}
            autoPlay
            loop
            style={{ width: 100, height: 100 }}
          ></LottieView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "flex-end",
  },
  content: {
    width: "100%",
    height: "95%",
    backgroundColor: "white",
    paddingTop: 15,
    paddingBottom: 15,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    position: "relative",
    justifyContent: "center",
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 10,
    paddingLeft: 10,
  },
  body: {
    marginTop: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    paddingBottom: 100,
  },
  input: {
    marginTop: 20,
    width: "90%",
    backgroundColor: "#f1f4f5",
    padding: 10,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  input2: {
    marginTop: 20,
    width: "100%",
    backgroundColor: "#f1f4f5",
    padding: 15,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    display: "flex",
    flexDirection: "row",
    position: "relative",
  },
  list: {
    width: "100%",
    backgroundColor: "#f1f4f5",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: "absolute",
    top: "110%",
    display: "none",
  },
  item: {
    width: "100%",
    padding: 10,
  },
  listShow: {
    width: "100%",
    backgroundColor: "#f1f4f5",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: "absolute",
    top: "110%",
    zIndex: 2,
  },
  input3: {
    marginTop: 20,
    width: "100%",
    backgroundColor: "#f1f4f5",
    padding: 10,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    textAlign: "auto",
  },
  imgGroup: {
    display: "flex",
    flexDirection: "row",
    width: "90%",
    marginTop: 20,
    justifyContent: "space-between",
  },
  btn: {
    backgroundColor: "#f1f4f5",
    width: "48%",
    padding: 10,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  imgShow: {
    display: "flex",
    flexDirection: "row",
    width: "90%",
    marginTop: 20,
    justifyContent: "space-between",
    position: "relative",
  },
  countImg: {
    backgroundColor: "grey",
    width: "48%",
    aspectRatio: "1/1",
    borderRadius: 5,
    position: "absolute",
    right: 0,
    opacity: 0.5,
    display: "none",
  },
  countImgShow: {
    backgroundColor: "grey",
    width: "48%",
    aspectRatio: "1/1",
    borderRadius: 5,
    position: "absolute",
    right: 0,
    opacity: 0.7,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#2245ac",
    marginTop: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "48%",
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  button2: {
    width: "90%",
    borderRadius: 5,
    backgroundColor: "#3257c6",
    padding: 10,
    elevation: 2,
    marginTop: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  inforTicket: {
    width: "90%",
    padding: 10,
    borderRadius: 5,
  },
  ticketStatus: {
    width: "100%",
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
    shadowColor: "#000",
  },
  groupStatus: {
    width: "90%",
    marginTop: 20,
    padding: 5,
    borderRadius: 5,
    shadowColor: "#000",
  },
});
