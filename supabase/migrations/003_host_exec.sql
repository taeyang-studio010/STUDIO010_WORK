-- 호스트(조태양)만 관리자(exec)로 설정. 초대받은 사용자는 일반 멤버로만 가입됩니다.
update public.profiles
set is_exec = true, updated_at = now()
where email = 'taeyang@studio010.kr';
