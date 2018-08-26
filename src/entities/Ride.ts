import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { rideStatus } from "../types/types";
import User from "./User";
@Entity()
class Ride extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "text",
    enum: ["ACCEPTED", "FINISHED", "CANCELED", "REQUESTING", "ONROUTE"],
    default: "REQUESTING"
  })
  status: rideStatus;

  @Column({ type: "text" })
  pickUpAddress: string;

  @Column({ type: "double precision", default: 0 })
  pickUpLat: number;

  @Column({ type: "double precision", default: 0 })
  pickUpLng: number;

  @Column({ type: "text" })
  dropOffAddress: string;

  @Column({ type: "double precision", default: 0 })
  dropOffLat: number;

  @Column({ type: "double precision", default: 0 })
  dropOffLng: number;

  @Column({ type: "double precision", default: 0 })
  price: number;

  @Column({ type: "text" })
  distance: string;

  @Column({ type: "text" })
  duration: string;

  @Column({ nullable: true })
  passengerId: number;
  //typeorm이 자동으로 데이터베이스를 보지도 않고 반환해줌
  //전체 객체를 찾아서 보여줄 필요가 없음

  //승객은 항상있음
  @ManyToOne(type => User, user => user.ridesAsPassenger)
  passenger: User;

  @Column({ nullable: true })
  driverId: number;
  //typeorm이 자동으로 데이터베이스를 보지도 않고 반환해줌
  //전체 객체를 찾아서 보여줄 필요가 없음

  //nullable이 true인 이유는 ride를 요청할때는 아직 드라이버가 할당되지 않았기 상태이기 떄문
  @ManyToOne(type => User, user => user.ridesAsDriver, { nullable: true })
  driver: User;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
export default Ride;
