package demo.support;

import demo.modal.entity.Other;
import demo.modal.entity.SeatRoom;
import demo.modal.entity.Voucher;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Random;

public class MethodSupport {
    public static String randomConfirmationCode(){
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder confirmationCode = new StringBuilder();
        Random rand = new Random();
        for (int i = 0; i < 5; i++) {
            int randomIndex = rand.nextInt(chars.length());
            confirmationCode.append(chars.charAt(randomIndex));
        }

        return confirmationCode.toString();
    }

    public static <E extends Enum<E>> E convertStringToEnum(Class<E> enumClass, String string){
        if (enumClass == null || string == null){
            throw new NullPointerException();
        }
        try{
            return Enum.valueOf(enumClass, string.toUpperCase());
        }catch (IllegalArgumentException e){
            throw new IllegalArgumentException(
                    "Invalid enum value: " + enumClass.getSimpleName() + ": " + string
            );
        }
    }

    public static LocalDate convertToLocalDate(String dateString){
        try {
            DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            return LocalDate.parse(dateString, dateFormatter);
        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("Định dạng ngày không hợp lệ: " + dateString + ". Định dạng yêu cầu: yyyy-MM-dd");
        }
    }

    public static LocalTime convertToLocalTime(String timeString) {
        try {
            DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");
            return LocalTime.parse(timeString, timeFormatter);
        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("error formatter time: " + timeString);
        }
    }

    public static LocalDateTime buildLocalDateTime(String date, String time) {
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");
        return LocalDateTime.of(LocalDate.parse(date, dateFormatter), LocalTime.parse(time, timeFormatter));
    }

    public static int calculatePriceBooking(List<SeatRoom> seats,
                                            List<Other> others,
                                            Voucher voucher) {
        int totalPrice = 0;

        if (seats != null && !seats.isEmpty()) {
            for (SeatRoom seat : seats) {
                if (seat != null && seat.getSeat().getPrice() > 0) {
                    totalPrice += seat.getSeat().getPrice();
                }
            }
        }

        if (others != null && !others.isEmpty()) {
            for (Other other : others) {
                if (other != null && other.getPrice() > 0) {
                    totalPrice += other.getPrice();
                }
            }
        }

        if (voucher != null && voucher.getDiscount() > 0) {
            totalPrice -= voucher.getDiscount();
        }

        return Math.max(totalPrice, 0);
    }


}
